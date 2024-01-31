/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import _ from 'lodash'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { UpdateTaskDurationCommand } from './update-task-duration.command'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'

@CommandHandler(UpdateTaskDurationCommand)
export class UpdateTaskDurationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort, // @ts-ignore
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @GenerateAssignedTaskModificationHistory()
  async execute(command: UpdateTaskDurationCommand): Promise<void> {
    const entity = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!entity) throw new AssignedTaskNotFoundException()

    await entity.setDuration(command.duration, this.orderModificationValidator)

    await this.assignedTaskRepo.update(entity)
  }
}
