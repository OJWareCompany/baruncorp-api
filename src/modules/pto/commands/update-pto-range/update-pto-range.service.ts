/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdatePtoRangeCommand } from './update-pto-range.command'
import { PtoEntity } from '../../domain/pto.entity'
import { Prisma } from '@prisma/client'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'
import { PtoDetail } from '../../domain/value-objects/pto.detail.vo'
import { addYears, subDays } from 'date-fns'
import { Inject } from '@nestjs/common'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { PtoRepositoryPort } from '../../database/pto.repository.port'

@CommandHandler(UpdatePtoRangeCommand)
export class UpdatePtoRangeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY)
    private readonly ptoRepository: PtoRepositoryPort,
  ) {}
  async execute(command: UpdatePtoRangeCommand): Promise<void> {
    // PTO 리스트 검색
    const condition: Prisma.PtosWhereInput = {
      userId: command.userId,
    }
    const entities: PtoEntity[] = await this.ptoRepository.findMany(condition)
    // 각 PTO들의 startedAt, endedAt 변경(tenure는 1년차부터 존재하며, 변경 할 필요 없음.)
    entities.forEach((entity) => {
      entity.renewDateRange()
      entity.checkUpdateValidate()
    })
    // 업데이트 된 PTO 상태 저장
    await this.ptoRepository.updateMany(entities)
    // 모든 PtoDetails 추출
    const allPtoDetails: PtoDetail[] = entities.flatMap((entity) => entity.details)
    // 필요한 PTO 구간만 남김
    await this.doOrderingPto(entities, allPtoDetails, command)
    // 각 PTO Details들의 PTO 매핑 정보 변경(변경 사항 있다면)
    await this.doMappingPtoDetailsToPtos(entities, allPtoDetails)
  }

  private async doOrderingPto(ptoEntities: PtoEntity[], ptoDetails: PtoDetail[], command: UpdatePtoRangeCommand) {
    // 추후 dateOfJoinning이 null로 수정 되는 경우 기존 PTO 데이터 리셋해야하는지 확인 필요
    if (command.dateOfJoining === null) {
      return
    }

    // console.log(`[doOrderingPto] ptoDetails: ${JSON.stringify(ptoDetails)}`)

    const latestPtoDetail: PtoDetail | null =
      ptoDetails.length !== 0
        ? ptoDetails.reduce((prev, current) => {
            return current.startedAt > prev.startedAt ? current : prev
          })
        : null

    // console.log(`[doOrderingPto] latestPtoDetail: ${JSON.stringify(latestPtoDetail)}`)

    const promises: Promise<void>[] = []
    // 1년차의 pto부터 검사.
    const currentDate = new Date()
    // console.log(`[doOrderingPto] currentDate : ${currentDate.toISOString()}`)
    for (let tenure = 1; tenure <= 20; tenure++) {
      const targetEntity = ptoEntities.find((entity) => entity.tenure === tenure)
      // 해당 년차의 PTO가 존재한다면 다음 년차의 PTO를 검사하기 위해 Continue
      const targetPtoStartedAt = addYears(command.dateOfJoining, tenure - 1)
      const targetPtoEndedAt = subDays(addYears(targetPtoStartedAt, 1), 1)
      // console.log(`[doOrderingPto] tenure : ${tenure}`)
      // console.log(`[doOrderingPto] targetPtoStartedAt : ${targetPtoStartedAt.toISOString()}`)
      // console.log(`[doOrderingPto] targetPtoEndedAt : ${targetPtoEndedAt.toISOString()}`)
      // console.log(`[doOrderingPto] targetEntity : ${JSON.stringify(targetEntity)}`)
      // tenure 별 PTO 존재 여부 검사
      if (targetEntity) {
        // 해당 tenure에 대한 PTO 존재
        if (latestPtoDetail) {
          // 등록된 연차 정보가 존재함
          if (latestPtoDetail.startedAt < targetPtoStartedAt) {
            // 필요없는 미래 구간의 PTO
            // PTO 제거
            // console.log(`[doOrderingPto] delete pto`)
            ptoEntities = ptoEntities.filter((entities) => entities.id !== targetEntity.id)
            promises.push(this.ptoRepository.delete(targetEntity.id))
          } else {
            // 보유 해야 할 PTO 구간 => continue
            continue
          }
        } else {
          // 등록된 연차 정보가 존재하지 않음
          if (currentDate < targetPtoStartedAt) {
            // 필요없는 미래 구간의 PTO
            // PTO 제거
            // console.log(`[doOrderingPto] delete pto`)
            ptoEntities = ptoEntities.filter((entities) => entities.id !== targetEntity.id)
            promises.push(this.ptoRepository.delete(targetEntity.id))
          } else {
            // 보유 해야 할 PTO 구간 => continue
            continue
          }
        }
      } else {
        // 해당 tenure에 대한 PTO 없음
        if (latestPtoDetail) {
          // 등록된 연차 정보가 존재함
          if (latestPtoDetail.startedAt < targetPtoStartedAt) {
            // 필요없는 미래 구간의 PTO => PTO 추가 하지 않고 continue
            continue
          } else {
            // 보유 해야 할 PTO 구간 => PTO 추가
            // console.log(`[doOrderingPto] app pto`)
            let total = 10
            const prevEntity = ptoEntities.find((entities) => entities.tenure === tenure - 1)
            if (prevEntity) {
              total = prevEntity.total + 1
            }
            const ptoEntity = PtoEntity.create({
              userId: command.userId,
              tenure: tenure,
              isPaid: false,
              total: total,
              startedAt: targetPtoStartedAt,
              endedAt: targetPtoEndedAt,
              dateOfJoining: command.dateOfJoining,
            })
            ptoEntities.push(ptoEntity)
            promises.push(this.ptoRepository.insert(ptoEntity))
          }
        } else {
          // 등록된 연차 정보가 존재하지 않음
          if (currentDate < targetPtoStartedAt) {
            // 필요없는 미래 구간의 PTO => continue
            continue
          } else {
            // 보유 해야 할 PTO 구간 => PTO 추가
            // console.log(`[doOrderingPto] app pto`)
            let total = 10
            const prevEntity = ptoEntities.find((entities) => entities.tenure === tenure - 1)
            if (prevEntity) {
              total = prevEntity.total + 1
            }
            const ptoEntity = PtoEntity.create({
              userId: command.userId,
              tenure: tenure,
              isPaid: false,
              total: total,
              startedAt: targetPtoStartedAt,
              endedAt: targetPtoEndedAt,
              dateOfJoining: command.dateOfJoining,
            })
            ptoEntities.push(ptoEntity)
            promises.push(this.ptoRepository.insert(ptoEntity))
          }
        }
      }
    }
    await Promise.all(promises)
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
}
