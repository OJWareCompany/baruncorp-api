import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { DetermineActiveStatusDomainService } from '../../domain/domain-services/determine-active-status.domain-service'
import { AssignedTaskCreatedDomainEvent } from '../../domain/events/assigned-task-created.domain-event'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskMapper } from '../../assigned-task.mapper'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class ActivateTaskWhenTaskIsCreatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly determineActiveStatusService: DetermineActiveStatusDomainService,
    private readonly mapper: AssignedTaskMapper,
  ) {}

  @OnEvent(AssignedTaskCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskCreatedDomainEvent) {
    // const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    // await assignedTask.determineActiveStatus(this.determineActiveStatusService, this.prismaService)
    // await this.assignedTaskRepo.update(assignedTask)

    /**
     * 모든 태스크가 생성된 이후에 활성화 여부를 판단할수있다.
     */
    const assignedTasks = await this.prismaService.assignedTasks.findMany({ where: { jobId: event.jobId } })
    const assignedTaskEntities = assignedTasks.map(this.mapper.toDomain)

    const orderedServices = await this.prismaService.orderedServices.findMany({ where: { jobId: event.jobId } })
    const tasks = await this.prismaService.tasks.findMany({
      where: {
        serviceId: { in: orderedServices.map((service) => service.serviceId) },
      },
    })
    if (tasks.length > assignedTasks.length) return

    for (const assignedTask of assignedTaskEntities) {
      await assignedTask.determineActiveStatus(this.determineActiveStatusService)
      await this.assignedTaskRepo.update(assignedTask)
    }
  }
}
