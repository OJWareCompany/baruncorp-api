import { OnEvent } from '@nestjs/event-emitter'
import { AssignedTaskAssignedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-assigned.domain-event'
import { AssigningTaskAlertGateway } from '../../assigning-task-alert.gateway'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler {
  constructor(private readonly assigningTaskAlertService: AssigningTaskAlertGateway) {}
  @OnEvent(AssignedTaskAssignedDomainEvent.name, { async: true, promisify: true })
  handle(event: AssignedTaskAssignedDomainEvent) {
    this.assigningTaskAlertService.emitTaskAssignedEvent(event.assigneeUserId, {
      jobId: event.jobId,
      taskName: event.taskName,
      assignedTaskId: event.taskId,
      isRevision: event.isRevision,
      mountingType: event.mountingType,
      projectPropertyType: event.projectPropertyType,
      note: event.note,
    })
  }
}
