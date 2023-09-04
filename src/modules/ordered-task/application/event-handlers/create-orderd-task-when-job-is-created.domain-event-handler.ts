import { Inject, Injectable } from '@nestjs/common'
import { Prisma, Services } from '@prisma/client'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { ORDERED_TASK_REPOSITORY } from '../../ordered-task.di-token'
import { OrderedTaskRepositoryPort } from '../../database/ordered-task.repository.port'
import { OrderedTaskEntity } from '../../domain/ordered-task.entity'
import { convertToAssignableTask } from '../../domain/convert-to-assignable-task'

@Injectable()
export class CreateOrderedTaskWhenJobIsCreatedDomainEventHandler {
  constructor(
    @Inject(ORDERED_TASK_REPOSITORY) private readonly orderedTaskRepository: OrderedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent): Promise<void> {
    const taskIds: string[] = event.orderedTasks.map((task) => task.taskId)
    const services = await this.prismaService.services.findMany()
    const tasks = convertToAssignableTask([...new Set(taskIds)], services)

    const entities = tasks.map(async (task) => {
      const oldTask = await this.prismaService.orderedTasks.findFirst({
        where: { taskMenuId: task.id, projectId: event.projectId },
      })
      return OrderedTaskEntity.create({
        isNewTask: oldTask ? false : true,
        taskName: task.name,
        taskMenuId: task.id,
        description: task.description,
        jobId: event.aggregateId,
        projectId: event.projectId,
        assigneeName: null,
        assigneeUserId: null,
      })
    })

    const inserts = await Promise.all(entities)

    await this.prismaService.orderedTasks.createMany({
      data: inserts.map((task) => ({
        ...task.getProps(),
      })),
    })
  }
}
