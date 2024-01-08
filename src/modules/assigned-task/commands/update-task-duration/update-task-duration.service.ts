/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { UpdateTaskDurationCommand } from './update-task-duration.command'
import { TaskStatusChangeValidationDomainService } from '../../domain/domain-services/task-status-change-validation.domain-service'

@CommandHandler(UpdateTaskDurationCommand)
export class UpdateTaskDurationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly taskStatusValidator: TaskStatusChangeValidationDomainService,
  ) {}
  async execute(command: UpdateTaskDurationCommand): Promise<void> {
    const entity = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!entity) throw new AssignedTaskNotFoundException()
    await entity.setDuration(command.duration, this.taskStatusValidator)

    await this.assignedTaskRepo.update(entity)
  }
}
