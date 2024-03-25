import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { JobPriorityUpdatedDomainEvent } from '../../../ordered-job/domain/events/job-priority-updated.domain-event'
import { Priority } from '../../../ordered-job/domain/value-objects/priority.value-object'

export class UpdatePriorityWhenJobPriorityIsUpdatedDomainEventHandler {
  constructor(@Inject(ASSIGNED_TASK_REPOSITORY) private readonly assignedTaskRepo: AssignedTaskRepositoryPort) {}
  @OnEvent(JobPriorityUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobPriorityUpdatedDomainEvent) {
    const assignedTasks = await this.assignedTaskRepo.find({ jobId: event.aggregateId })
    for (const assignedTask of assignedTasks) {
      assignedTask.setPriority(new Priority({ priority: event.priority }))
    }
    await this.assignedTaskRepo.update(assignedTasks)
  }
}
