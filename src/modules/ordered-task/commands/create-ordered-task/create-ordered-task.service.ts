/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Users } from '@prisma/client'
import { PrismaService } from '../../../database/prisma.service'
import { NewOrderedTasks } from '../../../ordered-job/domain/value-objects/ordered-task.value-object'
import { JobCompletedUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { OrderedTaskEntity } from '../../domain/ordered-task.entity'
import { convertToAssignableTask } from '../../domain/convert-to-assignable-task'
import { OrderedTaskRepositoryPort } from '../../database/ordered-task.repository.port'
import { ORDERED_TASK_REPOSITORY } from '../../ordered-task.di-token'
import { CreateOrderedTaskCommand } from './create-ordered-task.command'

@CommandHandler(CreateOrderedTaskCommand)
export class CreateOrderedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_TASK_REPOSITORY) private readonly orderedTaskRepository: OrderedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(command: CreateOrderedTaskCommand): Promise<{ ids: string[] }> {
    const job = await this.prismaService.orderedJobs.findUnique({
      where: { id: command.jobId },
      include: { orderedTasks: true },
    })

    if (!job) throw new JobNotFoundException()
    const jobEntity = this.jobMapper.toDomain(job)
    if (jobEntity.isCompleted()) throw new JobCompletedUpdateException()

    const tasks = await this.prismaService.orderedTasks.findMany({
      where: { projectId: job.projectId, taskMenuId: command.taskMenuId },
    })

    const newOrderedTask = new NewOrderedTasks({ taskId: command.taskMenuId, description: command.description })

    const services = await this.prismaService.services.findMany()
    const assignableTask = convertToAssignableTask(newOrderedTask, services)

    assignableTask.map((newTask) => {
      job.orderedTasks.map((existingTask) => {
        if (newTask.name === 'Other') return
        if (newTask.id === existingTask.taskMenuId)
          throw new ConflictException(`${newTask.name} is already existed.`, '40002')
      })
    })

    let member: Users | null
    if (command.assignedUserId) {
      member = await this.prismaService.users.findUnique({ where: { id: command.assignedUserId } })
    }

    const entities = assignableTask.map((task) => {
      return OrderedTaskEntity.create({
        invoiceAmount: null, // TODO!
        isNewTask: !!tasks.length ? false : true,
        taskName: task.name,
        taskMenuId: command.taskMenuId,
        jobId: command.jobId,
        projectId: job.projectId,
        assigneeName: member ? member.firstName + ' ' + member.lastName : null,
        assigneeUserId: member ? member.id : null,
        description: command.description,
      })
    })
    await this.orderedTaskRepository.insert(entities)

    return {
      ids: entities.map((entity) => entity.id),
    }
  }
}
