import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateAssignedTaskProps, AssignedTaskProps, AssignedTaskStatus } from './assigned-task.type'

export class AssignedTaskEntity extends AggregateRoot<AssignedTaskProps> {
  protected _id: string

  static create(create: CreateAssignedTaskProps) {
    const id = v4()
    const props: AssignedTaskProps = {
      ...create,
      status: 'Not Started',
      startedAt: null,
      doneAt: null,
    }
    return new AssignedTaskEntity({ id, props })
  }

  complete(): this {
    this.props.status = 'Completed'
    this.props.doneAt = new Date()
    return this
  }

  cancel(): this {
    this.props.status = 'Canceled'
    this.props.doneAt = new Date()
    return this
  }

  setAssigneeId(assigneeId: string): this {
    this.props.assigneeId = assigneeId
    if (assigneeId) {
      this.props.status = 'In Progress'
      this.props.startedAt = new Date()
    }
    return this
  }

  public validate(): void {
    return
  }
}
