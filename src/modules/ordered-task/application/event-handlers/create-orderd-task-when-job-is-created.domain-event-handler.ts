import { Inject, Injectable } from '@nestjs/common'
import { Prisma, Services } from '@prisma/client'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { ORDERED_TASK_REPOSITORY } from '../../ordered-task.di-token'
import { OrderedTaskRepositoryPort } from '../../database/ordered-task.repository.port'
import { OrderedTaskEntity } from '../../domain/ordered-task.entity'

@Injectable()
export class CreateOrderedTaskWhenJobIsCreatedDomainEventHandler {
  constructor(
    @Inject(ORDERED_TASK_REPOSITORY) private readonly orderedTaskRepository: OrderedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent): Promise<void> {
    const tasks = await this.loadTasksMemberAssignment([...new Set(event.orderedTaskIds)])

    const entities = tasks.map(async (task) => {
      const oldTask = await this.prismaService.orderedTasks.findFirst({
        where: { taskMenuId: task.id, projectId: event.projectId },
      })
      return OrderedTaskEntity.create({
        isNewTask: oldTask ? false : true,
        taskName: task.name,
        taskMenuId: task.id,
        jobId: event.aggregateId,
        projectId: event.projectId,
      })
    })

    const inserts = await Promise.all(entities)

    await this.prismaService.orderedTasks.createMany({
      data: inserts.map((task) => ({
        ...task.getProps(),
      })),
    })
  }

  private async loadTasksMemberAssignment(taskId: string | string[]): Promise<Services[]> {
    const result: Services[] = []
    const condition = (taskId: string) => ({
      OR: [
        { is_member_assignment: true, id: taskId }, //
        { is_member_assignment: true, parent_task_id: taskId },
      ],
    })

    const taskIds = Array.isArray(taskId) ? taskId : [taskId]
    for (const taskId of taskIds) {
      const task = await this.prismaService.services.findMany({
        where: condition(taskId) as Prisma.ServicesWhereInput,
      })
      result.push(...task)
    }

    return result
  }
}
