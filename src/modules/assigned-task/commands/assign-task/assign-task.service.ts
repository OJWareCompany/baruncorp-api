/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { Inject } from '@nestjs/common'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { UNIQUE_CONSTRAINT_FAILED } from '../../../database/error-code'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { AssignedTaskPendingException } from '../../domain/assigned-task.error'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignTaskCommand } from './assign-task.command'

@CommandHandler(AssignTaskCommand)
export class AssignTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}

  @GenerateAssignedTaskModificationHistory({ invokedFrom: null, queryScope: null })
  async execute(command: AssignTaskCommand): Promise<void> {
    const userEntity = await this.userRepo.findOneByIdOrThrow(command.assigneeId)
    const assignedTaskEntity = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)

    await assignedTaskEntity.assign(userEntity, this.orderModificationValidator)
    await this.assignedTaskRepo.update(assignedTaskEntity)
  }
}
