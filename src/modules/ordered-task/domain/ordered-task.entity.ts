import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateOrderedTaskProps, OrderedTaskProps, TaskStatus } from './ordered-task.type'
import { OrderedTaskUpdatedDomainEvent } from './events/ordered-task-updated.domain-event'

export class OrderedTaskEntity extends AggregateRoot<OrderedTaskProps> {
  protected _id: string

  static create(create: CreateOrderedTaskProps) {
    const props: OrderedTaskProps = {
      ...create,
      dateCreated: new Date(),
      taskStatus: 'Not Started',
      isLocked: false,
    }
    return new OrderedTaskEntity({ id: v4(), props })
  }

  setIsLocked(isLocked: boolean) {
    this.props.isLocked = isLocked
    return this
  }

  setAssignee(assigneeName: string, assigneeUserId: string) {
    this.props.assigneeName = assigneeName
    this.props.assigneeUserId = assigneeUserId
    return this
  }

  setDescription(description: string) {
    this.props.assigneeName = description
    return this
  }

  setStatus(taskStatus: TaskStatus) {
    this.props.taskStatus = taskStatus
    return this
  }

  isCompleted(): boolean {
    return this.props.taskStatus === 'Completed'
  }

  addUpdateEvent() {
    this.addEvent(
      new OrderedTaskUpdatedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
        taskStatus: this.props.taskStatus,
      }),
    )
  }

  public validate(): void {
    const result = 1 + 1
  }
}
