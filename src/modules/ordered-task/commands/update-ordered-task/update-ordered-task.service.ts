/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JobStatusEnum } from '../../../ordered-job/domain/job.type'
import { OrderedTaskRepositoryPort } from '../../database/ordered-task.repository.port'
import { TaskStatusEnum } from '../../domain/ordered-task.type'
import { ORDERED_TASK_REPOSITORY } from '../../ordered-task.di-token'
import { UpdateOrderedTaskCommand } from './update-ordered-task.command'

@CommandHandler(UpdateOrderedTaskCommand)
export class UpdateOrderedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_TASK_REPOSITORY) private readonly orderedTaskRepository: OrderedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateOrderedTaskCommand): Promise<void> {
    const assignee = command.assigneeUserId
      ? await this.prismaService.users.findUnique({ where: { id: command.assigneeUserId } })
      : null

    const task = await this.orderedTaskRepository.findById(command.orderedTaskId)
    if (!task) throw new NotFoundException('Not Task found', '40007')

    task
      .setAssignee(assignee?.id, assignee?.firstName)
      .setDescription(command.description)
      .setIsLocked(command.isLocked)
      .setStatus(command.taskStatus)

    await this.orderedTaskRepository.update(task)

    if ([TaskStatusEnum.On_Hold, TaskStatusEnum.Canceled].includes(command.taskStatus as TaskStatusEnum)) {
      const associatedTasks = await this.orderedTaskRepository.findAssociatedTasks(task)
      const uncompletedTasks = associatedTasks.filter((task) => !task.isCompleted())
      uncompletedTasks.map((task) => task.setStatus(command.taskStatus))
      await this.orderedTaskRepository.update(uncompletedTasks)
    }
  }
}
