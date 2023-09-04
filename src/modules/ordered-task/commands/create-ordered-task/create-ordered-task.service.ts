/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateOrderedTaskCommand } from './create-ordered-task.command'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedTaskEntity } from '../../domain/ordered-task.entity'
import { convertToAssignableTask } from '../../domain/convert-to-assignable-task'
import { OrderedTaskRepositoryPort } from '../../database/ordered-task.repository.port'
import { ORDERED_TASK_REPOSITORY } from '../../ordered-task.di-token'

@CommandHandler(CreateOrderedTaskCommand)
export class CreateOrderedTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_TASK_REPOSITORY) private readonly orderedTaskRepository: OrderedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: CreateOrderedTaskCommand) {
    const job = await this.prismaService.orderedJobs.findUnique({
      where: { id: command.jobId },
      include: { orderedTasks: true },
    })

    const clientUser = await this.prismaService.users.findUnique({ where: { id: command.assignedUserId } })

    const tasks = await this.prismaService.orderedTasks.findMany({
      where: { projectId: job.projectId, taskMenuId: command.taskMenuId },
    })

    const services = await this.prismaService.services.findMany()
    const assignableTask = convertToAssignableTask(command.taskMenuId, services)

    assignableTask.map((newTask) => {
      job.orderedTasks.map((existingTask) => {
        if (newTask.id === existingTask.taskMenuId)
          throw new ConflictException(`${newTask.name} is already existed.`, '40002')
      })
    })

    const entities = assignableTask.map((task) => {
      return OrderedTaskEntity.create({
        isNewTask: !!tasks.length ? false : true,
        taskName: task.name,
        taskMenuId: command.taskMenuId,
        jobId: command.jobId,
        projectId: job.projectId,
        assigneeName: clientUser.firstName + ' ' + clientUser.lastName,
        assigneeUserId: clientUser.firstName + ' ' + clientUser.id,
        description: command.description,
      })
    })

    await this.orderedTaskRepository.insert(entities)
  }
}
