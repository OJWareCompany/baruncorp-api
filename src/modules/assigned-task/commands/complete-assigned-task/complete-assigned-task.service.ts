/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { CompleteAssignedTaskCommand } from './complete-assigned-task.command'
import { TaskStatusChangeValidationDomainService } from '../../domain/domain-services/task-status-change-validation.domain-service'

@CommandHandler(CompleteAssignedTaskCommand)
export class CompleteAssignedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly taskStatusValidator: TaskStatusChangeValidationDomainService,
  ) {}
  async execute(command: CompleteAssignedTaskCommand): Promise<void> {
    const assignedTask = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!assignedTask) throw new AssignedTaskNotFoundException()

    await assignedTask.complete(this.taskStatusValidator)
    await this.assignedTaskRepo.update(assignedTask)
  }
}
