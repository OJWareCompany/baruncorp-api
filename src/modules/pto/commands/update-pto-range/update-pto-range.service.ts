import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PaidPtoUpdateException, PtoNotFoundException } from '../../domain/pto.error'
import { UpdatePtoRangeCommand } from './update-pto-range.command'
import { PtoRepository } from '../../database/pto.repository'
import { PtoEntity } from '../../domain/pto.entity'
import { Prisma } from '@prisma/client'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'
import { PtoDetail } from '../../domain/value-objects/pto.detail.vo'
import { addYears, subDays } from 'date-fns'

@CommandHandler(UpdatePtoRangeCommand)
export class UpdatePtoRangeService implements ICommandHandler {
  constructor(private readonly ptoRepository: PtoRepository) {}
  async execute(command: UpdatePtoRangeCommand): Promise<void> {
    // PTO 리스트 검색
    const condition: Prisma.PtosWhereInput = {
      userId: command.userId,
    }
    const entities: PtoEntity[] = await this.ptoRepository.findMany(condition)
    // 각 PTO들의 startedAt, endedAt 변경(tenure는 1년차부터 존재하며, 변경 할 필요 없음.)
    entities.forEach(async (entity) => {
      entity.renewDateRange()
      entity.checkUpdateValidate()
    })
    // 업데이트 된 PTO 상태 저장
    await this.ptoRepository.updateMany(entities)
    // 모든 PtoDetails 추출
    const allPtoDetails: PtoDetail[] = entities.flatMap((entity) => entity.details)
    // PTO와 PtoDetail간의 매칭
    await this.addNewRequiredPto(entities, allPtoDetails, command)
    // 각 PTO Details들의 PTO 매핑 정보 변경(변경 사항 있다면)
    await this.doMappingPtoDetailsToPtos(entities, allPtoDetails)
  }

  private async addNewRequiredPto(ptoEntities: PtoEntity[], ptoDetails: PtoDetail[], command: UpdatePtoRangeCommand) {
    // 추후 dateOfJoinning이 null로 수정 되는 경우 기존 PTO 데이터 리셋해야하는지 확인 필요
    if (command.dateOfJoining === null) {
      return
    }
    const latestPtoDetail: PtoDetail | null = ptoDetails.reduce((prev, current) => {
      return current.startedAt > prev.startedAt ? current : prev
    })
    //this.findLatestPtoDetail(ptoDetails)
    // 시즌별 PTO에 Details가 존재하는 경우
    if (latestPtoDetail) {
      const insertPromises: Promise<void>[] = []
      // 1년차의 pto부터 검사.
      for (let tenure = 1; tenure <= 20; tenure++) {
        const findedEntity = ptoEntities.find((entity) => entity.tenure === tenure)
        // 해당 년차의 PTO가 존재한다면 다음 년차의 PTO를 검사하기 위해 Continue
        if (findedEntity) continue

        const startedAt = addYears(command.dateOfJoining, tenure - 1)
        const endedAt = subDays(addYears(startedAt, 1), 1)
        const ptoEntity = PtoEntity.create({
          userId: command.userId,
          tenure: tenure,
          isPaid: false,
          total: tenure + 9,
          startedAt: startedAt,
          endedAt: endedAt,
          dateOfJoining: command.dateOfJoining,
        })
        // console.log(`[doPtoMappingProcess] new latestPtoEntity : ${JSON.stringify(latestPtoEntity)}`, null, "\t")
        insertPromises.push(this.ptoRepository.insert(ptoEntity))
        ptoEntities.push(ptoEntity)
        // 가장 마지막 PTO가 가장 늦은 시점의 연차 기록(Pto Detail)을 포함 할 수 있는 상황
        if (latestPtoDetail.startedAt < ptoEntity.endedAt) {
          // Todo. 현재 tenure보다 큰 pto있으면 제거
          break
        }
      }
      await Promise.all(insertPromises)
    }
  }

  private async doMappingPtoDetailsToPtos(entities: PtoEntity[], ptoDetails: PtoDetail[]) {
    const updatePromises = ptoDetails.map(async (detail) => {
      for (const entity of entities) {
        if (entity.startedAt <= detail.startedAt && detail.startedAt <= entity.endedAt) {
          // 적절한 Pto 찾았을 때 업데이트 작업 프로미스 생성
          const newPtoDetailEntity = PtoDetailEntity.create({
            userId: entity.userId,
            ptoId: entity.id,
            ptoTypeId: detail.typeId,
            amount: detail.amount,
            days: detail.days,
            startedAt: detail.startedAt,
          })
          newPtoDetailEntity.id = detail.id
          return this.ptoRepository.updateDetail(newPtoDetailEntity)
        }
      }
    })

    await Promise.all(updatePromises)
  }

  private findLatestPtoDetail(ptoDetails: PtoDetail[]): PtoDetail | null {
    let latestPtoDetail: PtoDetail | null = null

    ptoDetails.forEach((detail) => {
      if (!latestPtoDetail || detail.startedAt > latestPtoDetail.startedAt) {
        latestPtoDetail = detail
      }
    })

    return latestPtoDetail
  }
}
