/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { AssignTaskCommand } from './assign-task.command'
import { OrderModificationValidatorDomainService } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

@CommandHandler(AssignTaskCommand)
export class AssignTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly orderModificationValidator: OrderModificationValidatorDomainService,
  ) {}
  async execute(command: AssignTaskCommand): Promise<void> {
    const userEntity = await this.userRepo.findOneByIdOrThrow(command.assigneeId)
    const assignedTaskEntity = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)

    await assignedTaskEntity.assign(userEntity, this.orderModificationValidator)
    await this.assignedTaskRepo.update(assignedTaskEntity)
  }
}
