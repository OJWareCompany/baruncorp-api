import { Inject } from '@nestjs/common'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { OnEvent } from '@nestjs/event-emitter'
import { DetermineActiveStatusDomainService } from '../../domain/domain-services/determine-active-status.domain-service'
import { AssignedTaskCompletedDomainEvent } from '../../domain/events/assigned-task-completed.domain-event'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class ActivateOtherTasksWhenTaskIsCompletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly determineActiveStatusService: DetermineActiveStatusDomainService,
    private readonly mapper: AssignedTaskMapper,
  ) {}

  @OnEvent(AssignedTaskCompletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskCompletedDomainEvent) {
    const assignedTasks = await this.prismaService.assignedTasks.findMany({ where: { jobId: event.jobId } })
    const assignedTaskEntities = assignedTasks.map(this.mapper.toDomain)

    for (const assignedTask of assignedTaskEntities) {
      await assignedTask.determineActiveStatus(this.determineActiveStatusService, this.prismaService)
      await this.assignedTaskRepo.update(assignedTask)
    }
  }
}
