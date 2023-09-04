import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'

interface CreateOrderedTaskProps {
  isNewTask: boolean
  taskName: string
  taskMenuId: string
  jobId: string
  projectId: string
  assigneeName: string | null
  assigneeUserId: string | null
  description: string | null
}

interface OrderedTaskProps {
  isNewTask: boolean
  isLocked: boolean
  taskStatus: string
  taskName: string
  taskMenuId: string
  jobId: string
  projectId: string
  dateCreated: Date
  assigneeName: string | null
  assigneeUserId: string | null
  description: string
}

export class OrderedTaskEntity extends AggregateRoot<OrderedTaskProps> {
  protected _id: string

  static create(create: CreateOrderedTaskProps) {
    const props: OrderedTaskProps = {
      ...create,
      dateCreated: new Date(),
      taskStatus: 'Not Started',
      isLocked: false,
      assigneeName: null,
      assigneeUserId: null,
    }
    return new OrderedTaskEntity({ id: v4(), props })
  }

  public validate(): void {
    // throw new Error('Method not implemented.')
  }
}
