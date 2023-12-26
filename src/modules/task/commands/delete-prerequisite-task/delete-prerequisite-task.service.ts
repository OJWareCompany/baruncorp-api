/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeletePrerequisiteTaskCommand } from './delete-prerequisite-task.command'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { TASK_REPOSITORY } from '../../task.di-token'
import { Inject } from '@nestjs/common'
import { PreTaskNotFoundException, TaskNotFoundException } from '../../domain/task.error'
import { PrismaService } from '../../../database/prisma.service'

@CommandHandler(DeletePrerequisiteTaskCommand)
export class DeletePrerequisiteTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: DeletePrerequisiteTaskCommand): Promise<any> {
    const task = await this.taskRepo.findOne(command.taskId)
    if (!task) throw new TaskNotFoundException()

    const forPreTask = await this.taskRepo.findOne(command.prerequisiteTaskId)
    if (!forPreTask) throw new TaskNotFoundException()

    const preTask = await this.prismaService.prerequisiteTasks.findFirst({
      where: {
        taskId: command.taskId,
        prerequisiteTaskId: command.prerequisiteTaskId,
      },
    })

    if (!preTask) throw new PreTaskNotFoundException()

    await this.prismaService.prerequisiteTasks.delete({
      where: {
        taskId_prerequisiteTaskId: {
          taskId: command.taskId,
          prerequisiteTaskId: command.prerequisiteTaskId,
        },
      },
    })
  }
}
