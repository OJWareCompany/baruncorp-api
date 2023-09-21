import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateOrderedTaskProps, OrderedTaskProps, TaskStatus } from './ordered-task.type'
import { OrderedTaskUpdatedDomainEvent } from './events/ordered-task-updated.domain-event'
import { BadRequestException } from '@nestjs/common'

export class OrderedTaskEntity extends AggregateRoot<OrderedTaskProps> {
  protected _id: string

  static create(create: CreateOrderedTaskProps): OrderedTaskEntity {
    const props: OrderedTaskProps = {
      ...create,
      dateCreated: new Date(),
      taskStatus: 'Not Started',
    }
    return new OrderedTaskEntity({ id: v4(), props })
  }

  setInvoiceAmount(invoiceAmount: number | null): this {
    if (invoiceAmount !== null && invoiceAmount < 0) {
      throw new BadRequestException(`Only values greater than or equal to 0 are allowed`, '60003')
    }
    this.props.invoiceAmount = invoiceAmount
    return this
  }

  setAssignee(assigneeName: string | null, assigneeUserId: string | null): this {
    this.props.assigneeName = assigneeName
    this.props.assigneeUserId = assigneeUserId
    return this
  }

  setDescription(description: string | null): this {
    this.props.description = description
    return this
  }

  setStatus(taskStatus: TaskStatus): this {
    this.props.taskStatus = taskStatus
    return this
  }

  isCompleted(): boolean {
    return this.props.taskStatus === 'Completed'
  }

  addUpdateEvent(): void {
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
