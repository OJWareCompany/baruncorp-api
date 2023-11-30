import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateAssignedTaskProps, AssignedTaskProps, AssignedTaskStatus } from './assigned-task.type'
import { AssignedTaskAssignedDomainEvent } from './events/assigned-task-assigned.domain-event'
import { AssignedTaskCompletedDomainEvent } from './events/assigned-task-completed.domain-event'
import { AssignedTaskReopenedDomainEvent } from './events/assigned-task-reopened.domain-event'
import { AssignedTaskDurationUpdatedDomainEvent } from './events/assigned-task-duration-updated.domain-event'

export class AssignedTaskEntity extends AggregateRoot<AssignedTaskProps> {
  protected _id: string

  static create(create: CreateAssignedTaskProps) {
    const id = v4()
    const props: AssignedTaskProps = {
      ...create,
      status: 'Not Started',
      duration: null,
      startedAt: null,
      doneAt: null,
    }
    return new AssignedTaskEntity({ id, props })
  }

  complete(): this {
    this.props.status = 'Completed'
    this.props.doneAt = new Date()
    this.addEvent(
      new AssignedTaskCompletedDomainEvent({
        aggregateId: this.id,
        orderedServiceId: this.props.orderedServiceId,
      }),
    )
    return this
  }

  cancel(): this {
    if (this.props.status === 'Completed') return this
    this.props.status = 'Canceled'
    this.props.doneAt = new Date()
    return this
  }

  hold(): this {
    if (this.props.status === 'Completed' || this.props.status === 'Canceled') return this
    this.props.status = 'On Hold'
    this.props.doneAt = new Date()
    return this
  }

  reopen(): this {
    if (this.props.status === 'Completed') return this
    this.props.status = 'Not Started'
    this.props.doneAt = null
    this.props.assigneeId = null
    this.addEvent(
      new AssignedTaskReopenedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  setAssigneeId(assigneeId: string): this {
    this.props.assigneeId = assigneeId
    this.props.status = 'In Progress'
    this.props.startedAt = new Date()
    this.addEvent(
      new AssignedTaskAssignedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  setDuration(duration: number | null): this {
    this.props.duration = duration
    this.addEvent(
      new AssignedTaskDurationUpdatedDomainEvent({
        aggregateId: this.id,
        orderedServiceId: this.props.orderedServiceId,
      }),
    )
    return this
  }

  public validate(): void {
    return
  }
}
