/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PutScheduleCommand } from './put-schedule.command'
import { Inject } from '@nestjs/common'
import { ScheduleRepositoryPort } from '../../database/schedule.repository.port'
import { ScheduleEntity } from '../../domain/schedule.entity'
import { UserRepositoryPort } from '@modules/users/database/user.repository.port'
import { SCHEDULE_REPOSITORY } from '@modules/schedule/schedule.di-token'
import { USER_REPOSITORY } from '@modules/users/user.di-tokens'
import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'

@CommandHandler(PutScheduleCommand)
export class PutScheduleService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SCHEDULE_REPOSITORY) private readonly scheduleRepository: ScheduleRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(command: PutScheduleCommand): Promise<void> {
    // 유저 존재하는지 확인
    await this.userRepository.findOneByIdOrThrow(command.userId)
    // 엔티티 생성
    const entity: ScheduleEntity = new ScheduleEntity({
      id: command.userId,
      props: {
        schedules: command.schedules,
      },
    })
    entity.checkValidation()
    // Put
    await this.scheduleRepository.upsert(entity)
  }
}
