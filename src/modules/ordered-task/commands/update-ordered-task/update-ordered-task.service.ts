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

    const task = await this.prismaService.orderedTasks.findUnique({ where: { id: command.orderedTaskId } })
    if (!task) throw new NotFoundException('Not Task found', '40007')

    await this.prismaService.orderedTasks.update({
      where: { id: command.orderedTaskId },
      data: {
        isLocked: command.isLocked,
        taskStatus: command.taskStatus,
        ...(assignee && { assigneeUserId: assignee.id }),
        ...(assignee && { assigneeName: assignee.firstName + ' ' + assignee.lastName }),
        description: command.description,
      },
    })

    if ([TaskStatusEnum.On_Hold, TaskStatusEnum.Canceled].includes(command.taskStatus as TaskStatusEnum)) {
      // TODO: 이벤트로 빼기
      await this.prismaService.orderedTasks.updateMany({
        where: { jobId: task.jobId, taskStatus: { not: TaskStatusEnum.Completed } },
        data: {
          taskStatus: command.taskStatus,
        },
      })

      // TODO 이벤트로 빼기
      await this.prismaService.orderedJobs.update({
        where: { id: task.jobId },
        data: { jobStatus: JobStatusEnum.On_Hold },
      })
    } else if (command.taskStatus === TaskStatusEnum.Completed) {
      // TODO 이벤트로 빼기
      const tasks = await this.prismaService.orderedTasks.findMany({ where: { jobId: task.jobId } })

      const isAllCompleted = tasks.every((task) => task.taskStatus === TaskStatusEnum.Completed)
      if (isAllCompleted) {
        await this.prismaService.orderedJobs.update({
          where: { id: task.jobId },
          data: { jobStatus: JobStatusEnum.Completed },
        })
      }
    }
  }
}
