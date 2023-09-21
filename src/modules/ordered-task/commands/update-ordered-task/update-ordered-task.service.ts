/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JobCompletedUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
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
    private readonly jobMapper: JobMapper,
  ) {}
  async execute(command: UpdateOrderedTaskCommand): Promise<void> {
    const assignee = command.assigneeUserId
      ? await this.prismaService.users.findUnique({ where: { id: command.assigneeUserId } })
      : null

    const task = await this.orderedTaskRepository.findById(command.orderedTaskId)
    if (!task) throw new NotFoundException('Not Task found', '40007')

    const isCompletedTask = task.getProps().taskStatus === 'Completed'
    if (!!isCompletedTask) throw new BadRequestException('Completed task can`t updated.', '40008')

    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: task.getProps().jobId } })
    if (!job) throw new JobNotFoundException()
    const jobEntity = this.jobMapper.toDomain({ ...job, orderedTasks: [] })
    if (jobEntity.isCompleted()) throw new JobCompletedUpdateException()

    const assigneeName = assignee ? assignee.firstName + ' ' + assignee.lastName : null
    const assigneeId = assignee ? assignee.id : null
    task
      .setInvoiceAmount(command.invoiceAmount)
      .setAssignee(assigneeName, assigneeId)
      .setDescription(command.description)
      .setStatus(command.taskStatus)
    await this.orderedTaskRepository.update(task)

    if ([TaskStatusEnum.On_Hold].includes(command.taskStatus as TaskStatusEnum)) {
      // TODO: status any
      const associatedTasks = await this.orderedTaskRepository.findByJobId(task.getProps().jobId)
      const uncompletedTasks = associatedTasks.filter((task) => !task.isCompleted())
      uncompletedTasks.map((task) => task.setStatus(command.taskStatus))
      await this.orderedTaskRepository.update(uncompletedTasks)
    }
  }
}
