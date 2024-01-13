/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PtoEntity } from '../../domain/pto.entity'
import { CreatePtoDetailCommand } from './create-pto-detail.command'
import { PtoRepository } from '../../database/pto.repository'
import { PtoTenurePolicyRepository } from '../../../pto-tenure-policy/database/pto-tenure-policy.repository'
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

    // Todo. 연차 시작일 ~ day 중간에 기존에 설정한 연차가 존재한다면 에러

    // 연차 시작일 시점의 근속년수
    const startDateTenure = this.calcTenure(targetUser.dateOfJoining, command.startedAt)

    const endedAt: Date = new Date(command.startedAt)
    endedAt.setDate(endedAt.getDate() + command.days)
    endedAt.setTime(endedAt.getTime() - 1) // 1밀리 초 뺀다.
    console.log(`command.startedAt : ${command.startedAt.toISOString()}`)
    console.log(`endedAt : ${endedAt.toISOString()}`)
    console.log(`targetUser.dateOfJoining : ${targetUser.dateOfJoining.toISOString()}`)
    // 연차 종료일 시점의 근속년수
    const endDateTenure = this.calcTenure(targetUser.dateOfJoining, endedAt)
    console.log(`endDateTenure : ${endDateTenure}`)
    // 연차 시작일과 종료일에 대한 연차 시즌 정보(입사기념일 ~ 입사기념일 사이의 연차 현황)를 가져온다
    // ptos테이블에서 userId와 Tenure 쌍은 Unique하기에 targetDatePtoEntities는 0개, 1개, 2개가 생성 된다.
    // 2개(연차 시작일 ~ 종료일 사이에 입사 기념일이 겹침)의 Entity가 생성 됨
    const targetDatePtoEntities: PtoEntity[] = await this.ptoRepository.findPtoFromTenure(
      targetUser.id,
      startDateTenure,
      endDateTenure,
    )
    console.log(`targetDatePtoEntities : ${JSON.stringify(targetDatePtoEntities)}`)

    let newPtoDetailId: string | null = null
    if (startDateTenure === endDateTenure) {
      // 이어붙인 연차가 같은 시즌일 때(연차 요청 날짜 범위 중간에 입사 기념일이 존재하지 않는 경우)

      // Todo. 같은 날짜 겹치면 예외 throw
      // Todo. 현재보다 1년 이상 멀면 예외
      // targetDatePtoEntities.find((pto) => {
      //   pto.details
      // })

      newPtoDetailId = await this.doProccessing(
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

  private async doProccessing(
    targetPtoEntity: PtoEntity | null,
    command: CreatePtoDetailCommand,
    tenure: number,
  ): Promise<string> {
    if (targetPtoEntity) {
      // 하나의 PTO(시즌)이 검색된 경우 => PTO에 Detail 담아서 업데이트
      return await this.insertPtoDetail(targetPtoEntity, command)
    } else {
      // PTO(시즌) 없다면 => PTO(시즌)생성하여 담아서 함께 추가(예외 케이스)
      const total: number = await this.ptoTenurePolicyRepository.getTotalOfTenure(tenure)
      // 허가된 연차 보유량보다 많은 경우 예외 처리
      if (command.amountPerDay * command.days > total) throw new AnnualPtoNotExceedException()
      console.log(`total : ${total}`)
      const ptoEntity: PtoEntity = PtoEntity.create({
        userId: command.userId,
        tenure: tenure,
        isPaid: false,
        total: total,
      })

      console.log(`ptoEntity : ${ptoEntity}`)
      await this.ptoRepository.insert(ptoEntity)
      return await this.insertPtoDetail(ptoEntity, command)
    }
  }

  private async insertPtoDetail(targetPtoEntity: PtoEntity, command: CreatePtoDetailCommand) {
    // 이번 시즌에 사용 가능한 연차 수를 초과하면 예외 처리
    if (command.amountPerDay * command.days > targetPtoEntity.getUsablePtoValue()) {
      throw new AnnualPtoNotExceedException()
    }
    const targetPtoProps = targetPtoEntity.getProps()

    const ptoDetailEntity = PtoDetailEntity.create({
      ptoId: targetPtoProps.id,
      ptoTypeId: command.ptoTypeId,
      amount: command.amountPerDay,
      days: command.days,
      startedAt: command.startedAt,
    })

    await this.ptoRepository.insertDetail(ptoDetailEntity)

    return ptoDetailEntity.id
  }
}
