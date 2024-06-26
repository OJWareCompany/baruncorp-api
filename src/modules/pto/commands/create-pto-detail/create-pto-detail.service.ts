/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoDetailCommand } from './create-pto-detail.command'
import { PtoTargetUser } from '../../domain/value-objects/target.user.vo'
import {
  AnnualPtoNotExceedException,
  CanNotBeTakenPTOInOldDateException,
  DateOfJoiningNotFoundException,
  DaysRangeIssueException,
  OverlapsPtoException,
} from '../../domain/pto.error'
import { PtoDetailEntity } from '../../domain/pto-detail.entity'
import { addYears, subDays } from 'date-fns'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { PtoTenurePolicyRepositoryPort } from '../../../pto-tenure-policy/database/pto-tenure-policy.repository.port'
import { PTO_TENURE_REPOSITORY } from '../../../pto-tenure-policy/pto-tenure-policy.di-token'

@CommandHandler(CreatePtoDetailCommand)
export class CreatePtoDetailService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY) private readonly ptoRepository: PtoRepositoryPort, // @ts-ignore
    @Inject(PTO_TENURE_REPOSITORY) private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepositoryPort,
  ) {}
  async execute(command: CreatePtoDetailCommand): Promise<AggregateID> {
    // 유저 검색
    const targetUser: PtoTargetUser = await this.ptoRepository.findTargetUser(command.userId)
    // 해당 유저의 입사기념일이 존재하지 않는다면 Exception
    if (!targetUser.dateOfJoining) {
      throw new DateOfJoiningNotFoundException()
    }
    // 현재 입사기념일보다 과거 시점에 연차를 추가하려면 예외
    if (command.startedAt < targetUser.dateOfJoining) {
      throw new CanNotBeTakenPTOInOldDateException()
    }

    const startDateTenure = this.calcTenure(targetUser.dateOfJoining, command.startedAt)

    const endedAt: Date = new Date(command.startedAt)
    endedAt.setDate(endedAt.getDate() + command.days)
    endedAt.setTime(endedAt.getTime() - 1) // 1밀리 초 뺀다.
    // 연차 종료일 시점의 근속년수
    const endDateTenure = this.calcTenure(targetUser.dateOfJoining, endedAt)
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
      newPtoDetailId = await this.doProccessing(
        targetDatePtoEntities.length ? targetDatePtoEntities[0] : null,
        command,
        targetUser.dateOfJoining,
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

  private async doProccessing(
    targetPtoEntity: PtoEntity | null,
    command: CreatePtoDetailCommand,
    dateOfJoining: Date,
    tenure: number,
  ): Promise<string> {
    if (targetPtoEntity) {
      // 하나의 PTO(시즌)이 검색된 경우 => PTO에 Detail 담아서 업데이트
      return await this.insertPtoDetail(targetPtoEntity, command)
    } else {
      // PTO(시즌)을 찾지 못함 => PTO(시즌)생성하여 담아서 함께 추가(예외 케이스)
      const total: number = await this.ptoTenurePolicyRepository.getTotalOfTenure(tenure)

      const startedAt = addYears(dateOfJoining, tenure - 1)
      const endedAt = subDays(addYears(startedAt, 1), 1)
      const ptoEntity: PtoEntity = PtoEntity.create({
        userId: command.userId,
        tenure: tenure,
        isPaid: false,
        total: total,
        startedAt: startedAt,
        endedAt: endedAt,
        dateOfJoining: dateOfJoining,
      })

      await this.ptoRepository.insert(ptoEntity)
      return await this.insertPtoDetail(ptoEntity, command)
    }
  }

  private async insertPtoDetail(targetPtoEntity: PtoEntity, command: CreatePtoDetailCommand) {
    // 기존에 설정해놓은 연차 날짜 겹치면 예외 throw
    if (targetPtoEntity.hasPtoDetailDateInRange(command.startedAt, command.days)) {
      throw new OverlapsPtoException()
    }

    // 이번 시즌에 사용 가능한 연차 수를 초과하면 예외 처리
    const requestedTotalAmount = command.amountPerDay * command.days
    const usablePtoValue = targetPtoEntity.getUsablePtoValue()
    if (requestedTotalAmount > usablePtoValue) {
      throw new AnnualPtoNotExceedException()
    }
    const targetPtoProps = targetPtoEntity.getProps()

    const ptoDetailEntity = PtoDetailEntity.create({
      userId: command.userId,
      ptoId: targetPtoProps.id,
      ptoTypeId: command.ptoTypeId,
      amount: command.amountPerDay,
      days: command.days,
      startedAt: command.startedAt,
    })
    ptoDetailEntity.parentPtoEntity = targetPtoEntity
    ptoDetailEntity.checkUpdateValidate()

    await this.ptoRepository.insertDetail(ptoDetailEntity)
    return ptoDetailEntity.id
  }
}
