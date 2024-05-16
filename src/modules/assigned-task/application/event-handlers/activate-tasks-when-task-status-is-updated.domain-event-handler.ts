import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { DetermineActiveStatusDomainService } from '../../domain/domain-services/determine-active-status.domain-service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskMapper } from '../../assigned-task.mapper'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'
import { AssignedTaskStatusUpdatedDomainEvent } from '../../domain/events/assigned-task-status-updated.domain-event'

/* eslint-disable @typescript-eslint/ban-ts-comment */
export class ActivateTasksWhenTaskIsUpdatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly determineActiveStatusService: DetermineActiveStatusDomainService,
    private readonly mapper: AssignedTaskMapper,
  ) {}

  @OnEvent(AssignedTaskStatusUpdatedDomainEvent.name, { async: true, promisify: true })
  @GenerateAssignedTaskModificationHistory({ queryScope: 'job', invokedFrom: null })
  async handle(event: AssignedTaskStatusUpdatedDomainEvent) {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(event.aggregateId)
    const assignedTasks = await this.assignedTaskRepo.find({ jobId: assignedTask.jobId })

    for (const at of assignedTasks) {
      await at.determineActiveStatus(this.determineActiveStatusService)
      await this.assignedTaskRepo.update(at)
    }
  }
}
