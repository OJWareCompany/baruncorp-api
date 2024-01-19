/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { RejectAssignedTaskCommand } from './reject-assigned-task.command'
import { AssignedTaskAlreadyCompletedException, AssigneeNotFoundException } from '../../domain/assigned-task.error'
import { v4 } from 'uuid'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'

@CommandHandler(RejectAssignedTaskCommand)
export class RejectAssignedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly orderModificationValidator: OrderModificationValidator,
  ) {}
  async execute(command: RejectAssignedTaskCommand): Promise<void> {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)
    if (assignedTask.isCompleted) throw new AssignedTaskAlreadyCompletedException()

    const assigneeId = assignedTask.getProps().assigneeId
    if (!assigneeId) {
      throw new AssigneeNotFoundException()
    }

    const user = await this.userRepo.findOneByIdOrThrow(assigneeId)

    await assignedTask.unassign(this.orderModificationValidator)
    await this.assignedTaskRepo.update(assignedTask)
    await this.prismaService.rejectedTaskReasons.create({
      data: {
        id: v4(),
        assigneeUserId: user.id,
        assigneeUserName: user.getProps().userName.fullName,
        reason: command.reason,
        taskName: assignedTask.getProps().taskName,
        assignedTaskId: command.assignedTaskId,
        rejectedAt: new Date(),
      },
    })
  }
}
