/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CheckOutAssigningTaskAlertCommand } from './check-out-assigning-task-alert.command'
import { Inject } from '@nestjs/common'
import { ASSIGNING_TASK_ALERT_REPOSITORY } from '../../assigning-task-alert.di-token'
import { AssigningTaskAlertRepositoryPort } from '../../database/assigning-task-alert.repository.port'

@CommandHandler(CheckOutAssigningTaskAlertCommand)
export class CheckOutAssigningTaskAlertCommandHandler implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNING_TASK_ALERT_REPOSITORY) private readonly assigningTaskAlertRepo: AssigningTaskAlertRepositoryPort,
  ) {}

  async execute(command: CheckOutAssigningTaskAlertCommand): Promise<any> {
    const entity = await this.assigningTaskAlertRepo.findOneOrThrow(command.assigningTaskAlertId)
    entity.checkOut()
    await this.assigningTaskAlertRepo.update(entity)
  }
}
