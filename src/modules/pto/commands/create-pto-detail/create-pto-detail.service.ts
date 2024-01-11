/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoDetailCommand } from './create-pto-detail.command'
import { PtoRepository } from '../../database/pto.repository'
import { PtoTenurePolicyRepository } from '@src/modules/pto-tenure-policy/database/pto-tenure-policy.repository'
import { PtoTargetUser } from '../../domain/value-objects/target.user.vo'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@src/modules/database/prisma.service'
import { AnnualPtoNotExceedException, DaysRangeIssueException } from '../../domain/pto.error'
import { PtoDetail } from '../../domain/value-objects/pto.detail.vo'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'
import { Exception } from 'handlebars'

@CommandHandler(CreatePtoDetailCommand)
export class CreatePtoDetailService implements ICommandHandler {
  constructor(
    private readonly ptoRepository: PtoRepository,
    private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepository,
  ) {}
  async execute(command: CreatePtoDetailCommand): Promise<AggregateID> {
    // 유저 검색
    const targetUser: PtoTargetUser = await this.ptoRepository.findTargetUser(command.userId)
    // 연차 시작일 시점의 근속년수
    const startDateTenure = this.calcTenure(targetUser.dateOfJoining, command.startedAt)
    // 연차 종료일 시점의 근속년수
    const endDateTenure = this.calcTenure(targetUser.dateOfJoining, command.endedAt)
    // 연차 시작일과 종료일에 대한 연차 시즌 정보(입사기념일 ~ 입사기념일 사이의 연차 현황)를 가져온다
    // ptos테이블에서 userId와 Tenure 쌍은 Unique하기에 targetDatePtoEntities는 0개, 1개, 2개가 생성 된다.
    // 2개(연차 시작일 ~ 종료일 사이에 입사 기념일이 겹침)의 Entity가 생성 됨
    const targetDatePtoEntities: PtoEntity[] = await this.ptoRepository.findPtoFromTenure(
      targetUser.id,
      startDateTenure,
      endDateTenure,
    )

    let newPtoDetailId: string | null = null
    if (startDateTenure === endDateTenure) {
      // 이어붙인 연차가 같은 시즌일 때(연차 요청 날짜 범위 중간에 입사 기념일이 존재하지 않는 경우)
      newPtoDetailId = await this.doProccessingOneTenureSituation(
        targetDatePtoEntities.length ? targetDatePtoEntities[0] : null,
        command,
        startDateTenure,
      )
    } else {
      // 이어붙인 연차가 다른 시즌일 때(연차 요청 날짜 범위 중간에 입사 기념일이 존재)
      throw new DaysRangeIssueException()
    }

    return newPtoDetailId
  }

  private calcTenure(dateOfJoining: Date, targetDate: Date): number {
    const targetDateMilliseconds = targetDate.getTime()
    const userJoiningDateMilliseconds = dateOfJoining.getTime()
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000

    const ratioOfYear = (targetDateMilliseconds - userJoiningDateMilliseconds) / oneYearInMilliseconds

    return Math.floor(ratioOfYear + 1)
  }

  private async doProccessingOneTenureSituation(
    targetPtoEntity: PtoEntity | null,
    command: CreatePtoDetailCommand,
    tenure: number,
  ): Promise<string> {
    if (targetPtoEntity) {
      // 하나의 PTO(시즌)이 검색된 경우 => PTO에 Detail 담아서 업데이트
      const addedPtoDetailEntityId = this.addPtoDetailToTargetPto(targetPtoEntity, command)
      await this.ptoRepository.update(targetPtoEntity)

      return addedPtoDetailEntityId
    } else {
      // PTO(시즌) 없다면 => PTO(시즌)생성하여 담아서 함께 추가(예외 케이스)
      const total: number = await this.ptoTenurePolicyRepository.getTotalOfTenure(tenure)
      // 허가된 연차 보유량보다 많은 경우 예외 처리
      if (command.value > total) {
        throw new AnnualPtoNotExceedException()
      }
      const ptoEntity: PtoEntity = PtoEntity.create({
        userId: command.userId,
        tenure: tenure,
        isPaid: false,
        total: total,
      })
      const addedPtoDetailEntityId = this.addPtoDetailToTargetPto(ptoEntity, command)
      await this.ptoRepository.insert(ptoEntity)

      return addedPtoDetailEntityId
    }
  }

  private addPtoDetailToTargetPto(targetPtoEntity: PtoEntity, command: CreatePtoDetailCommand) {
    if (command.value > targetPtoEntity.getUsablePtoValue()) {
      throw new AnnualPtoNotExceedException()
    }
    const targetPtoProps = targetPtoEntity.getProps()

    const ptoDetailEntity = PtoDetailEntity.create({
      ptoId: targetPtoProps.id,
      ptoTypeId: command.ptoTypeId,
      value: command.value,
      startedAt: command.startedAt,
      endedAt: command.endedAt,
    })

    targetPtoProps.details.push(ptoDetailEntity)

    return ptoDetailEntity.id
  }
}
