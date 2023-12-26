import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateAssignedTaskProps, AssignedTaskProps, AssignedTaskStatusEnum } from './assigned-task.type'
import { AssignedTaskAssignedDomainEvent } from './events/assigned-task-assigned.domain-event'
import { AssignedTaskCompletedDomainEvent } from './events/assigned-task-completed.domain-event'
import { AssignedTaskReopenedDomainEvent } from './events/assigned-task-reopened.domain-event'
import { AssignedTaskDurationUpdatedDomainEvent } from './events/assigned-task-duration-updated.domain-event'
import { UserEntity } from '../../users/domain/user.entity'
import { CalculateVendorCostDomainService } from './calculate-vendor-cost.domain-service'
import { ExpensePricingEntity } from '../../expense-pricing/domain/expense-pricing.entity'
import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { AssignedTaskUnassignedDomainEvent } from './events/assigned-task-unassigned.domain-event'

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
      cost: null,
      isVendor: false,
      vendorInvoiceId: null,
      isActive: true,
    }
    const entity = new AssignedTaskEntity({ id: id, props })
    return entity
  }

  get orderedServiceId() {
    return this.props.orderedServiceId
  }

  get organizationId() {
    return this.props.organizationId
  }

  get taskId() {
    return this.props.taskId
  }

  get projectPropertyType() {
    return this.props.projectPropertyType
  }

  get isCompleted() {
    return this.props.status === AssignedTaskStatusEnum.Completed
  }

  invoice(vendorInvoiceId: string) {
    this.props.vendorInvoiceId = vendorInvoiceId
    return this
  }

  updateCost(
    calcService: CalculateVendorCostDomainService,
    expensePricing: ExpensePricingEntity,
    orderedService: OrderedServiceEntity,
  ) {
    this.props.cost = calcService.calcVendorCost(expensePricing, orderedService)
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
    this.props.assigneeName = null
    this.props.startedAt = null
    this.addEvent(
      new AssignedTaskReopenedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  unassign() {
    this.props.assigneeId = null
    this.props.assigneeName = null
    this.props.status = 'Not Started'
    this.props.startedAt = null
    this.props.doneAt = null
    this.addEvent(
      new AssignedTaskUnassignedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  assign(user: UserEntity): this {
    this.props.assigneeId = user.id
    this.props.assigneeName = user.getProps().userName.getFullName()
    this.props.status = 'In Progress'
    this.props.startedAt = new Date()
    if (user.isVendor) {
      this.props.isVendor = true
    }
    this.addEvent(
      new AssignedTaskAssignedDomainEvent({
        aggregateId: this.id,
        organizationId: this.props.organizationId,
        jobId: this.props.jobId,
        taskId: this.props.taskId,
        projectPropertyType: this.props.projectPropertyType,
        mountingType: this.props.mountingType,
        taskName: this.props.taskName,
        isRevision: this.props.isRevision,
        note: this.props.description,
        assigneeUserId: this.props.assigneeId,
        assigneeName: this.props.assigneeName,
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

  enterCostManually(cost: number | null) {
    this.props.cost = cost
    return this
  }

  public validate(): void {
    return
  }
}
