/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { CompleteAssignedTaskCommand } from './complete-assigned-task.command'

@CommandHandler(CompleteAssignedTaskCommand)
export class CompleteAssignedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CompleteAssignedTaskCommand): Promise<void> {
    const entity = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!entity) throw new AssignedTaskNotFoundException()
    entity.complete()
    await this.assignedTaskRepo.update(entity)
  }
}
