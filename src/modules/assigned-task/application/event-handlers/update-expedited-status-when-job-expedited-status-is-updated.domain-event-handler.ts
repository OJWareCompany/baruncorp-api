import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { JobExpeditedStatusUpdatedDomainEvent } from '../../../ordered-job/domain/events/job-expedited-status-updated.domain-event'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'

export class UpdateExpeditedStatusWhenJobExpeditedStatusIsUpdatedDomainEventHandler {
  constructor(@Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort) {}
  @OnEvent(JobExpeditedStatusUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobExpeditedStatusUpdatedDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({ jobId: event.aggregateId })
    for (const assignedTask of assignedTasks) {
      assignedTask.setIsExpedited(event.isExpedited)
    }
    await this.assignedTaskRepo.update(assignedTasks)
  }
}
