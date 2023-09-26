/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TASK_REPOSITORY } from '../../task.di-token'
import { DeleteTaskCommand } from './delete-task.command'
import { TaskNotFoundException } from '../../domain/task.error'

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeleteTaskCommand): Promise<void> {
    const entity = await this.taskRepo.findOne(command.taskId)
    if (!entity) throw new TaskNotFoundException()
    await this.taskRepo.delete(command.taskId)
  }
}
