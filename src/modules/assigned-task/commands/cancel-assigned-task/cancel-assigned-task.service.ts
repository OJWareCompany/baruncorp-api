import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { CancelAssignedTaskCommand } from './cancel-assigned-task.command'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
/* eslint-disable @typescript-eslint/ban-ts-comment */
@CommandHandler(CancelAssignedTaskCommand)
export class CancelAssignedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}
  async execute(command: CancelAssignedTaskCommand): Promise<void> {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)
    await assignedTask.cancelManually(this.orderModificationValidator)
    await this.assignedTaskRepo.update(assignedTask)
  }
}
