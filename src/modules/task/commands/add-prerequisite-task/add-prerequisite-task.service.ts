/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { TASK_REPOSITORY } from '../../task.di-token'
import { AddPrerequisiteTaskCommand } from './add-prerequisite-task.command'
import { TaskRepositoryPort } from '../../database/task.repository.port'
import { PreTaskConflictException, TaskNotFoundException } from '../../domain/task.error'

@CommandHandler(AddPrerequisiteTaskCommand)
export class AddPrerequisiteTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(TASK_REPOSITORY)
    private readonly taskRepo: TaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: AddPrerequisiteTaskCommand): Promise<void> {
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

    if (preTask) throw new PreTaskConflictException()

    await this.prismaService.prerequisiteTasks.create({
      data: {
        taskId: command.taskId,
        taskName: task.getProps().name,
        prerequisiteTaskId: command.prerequisiteTaskId,
        prerequisiteTaskName: forPreTask.getProps().name,
      },
    })
  }
}
