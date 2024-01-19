import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { UserEntity } from '../../users/domain/user.entity'
import { ExpensePricingEntity } from '../../expense-pricing/domain/expense-pricing.entity'
import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { PrismaService } from '../../database/prisma.service'
import { OrderModificationValidator } from '../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { CreateAssignedTaskProps, AssignedTaskProps, AssignedTaskStatusEnum } from './assigned-task.type'
import { AssignedTaskAssignedDomainEvent } from './events/assigned-task-assigned.domain-event'
import { AssignedTaskDurationUpdatedDomainEvent } from './events/assigned-task-duration-updated.domain-event'
import { CalculateVendorCostDomainService } from './calculate-vendor-cost.domain-service'
import { AssignedTaskCreatedDomainEvent } from './events/assigned-task-created.domain-event'
import { AssignedTaskActivatedDomainEvent } from './events/assigned-task-activated.domain-event'
import { DetermineActiveStatusDomainService } from './domain-services/determine-active-status.domain-service'
import { AssignedTaskAlreadyCompletedException, AssignedTaskDurationExceededException } from './assigned-task.error'
import { AssignedTaskCompletedDomainEvent } from './events/assigned-task-completed.domain-event'

export class AssignedTaskEntity extends AggregateRoot<AssignedTaskProps> {
  protected _id: string

  static create(create: CreateAssignedTaskProps) {
    const id = v4()
    const props: AssignedTaskProps = {
      ...create,
      status: AssignedTaskStatusEnum.Not_Started,
      assigneeId: null,
      assigneeName: null,
      assigneeOrganizationId: null,
      assigneeOrganizationName: null,
      duration: null,
      startedAt: null,
      doneAt: null,
      cost: null,
      isVendor: false,
      vendorInvoiceId: null,
      isActive: false,
    }
    const entity = new AssignedTaskEntity({ id: id, props })
    entity.addEvent(
      new AssignedTaskCreatedDomainEvent({
        aggregateId: entity.id,
        jobId: entity.getProps().jobId,
      }),
    )
    return entity
  }

  get orderedServiceId() {
    return this.props.orderedServiceId
  }

  get organizationId() {
    return this.props.organizationId
  }

  get projectId() {
    return this.props.projectId
  }

  get jobId() {
    return this.props.jobId
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

  get isCanceled() {
    return this.props.status === AssignedTaskStatusEnum.Canceled
  }

  get isRevision() {
    return this.props.isRevision
  }

  get status() {
    return this.props.status
  }

  /**
   * 취소/보류 되었을때 필요한가?
   * 취소/보류가 풀리면 active 이벤트가 발생해야하나?
   * 1. 취소/보류가 풀렸을때 자동 할당 필요 여부에 따라서, 일단은 X
   * 2. 필요하다면 이미 담당자가 있었을 경우에는 재배정 안하는것을 고려
   *
   * 특정 도메인 로직에 의해서만 호출되는 메서드
   */
  private deActive() {
    this.props.isActive = false
    return this
  }

  /**
   * Not Started, In Progress인 pre task가 없으면 활성화
   *
   * 태스크 생성 이벤트 -> 해당 태스크의 활성화 판별 -> 활성화 이벤트 -> 담당자 배정
   *   - job에서 활성화하면같은 태스크가 여러번 업데이트됨
   *   - task 각각이 하자. (자신의 활성화 판별 후 활성화)
   *
   * 태스크 완료 이벤트 -> 활성화될 태스크들 판별 -> 활성화 이벤트 -> 담당자 배정
   *    - 완료 되었을때 활성화될 태스크들을 판별 (전체)
   *
   * 활성화 이벤트는 한번에 하나씩 뿌리기, 한번에 두개가 할당될수있으니까.
   */
  private active() {
    this.props.isActive = true
    this.addEvent(
      new AssignedTaskActivatedDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  async determineActiveStatus(activeStatusService: DetermineActiveStatusDomainService, prismaService: PrismaService) {
    const isActive = await activeStatusService.isActive(this, prismaService)

    // active 메서드를 사용하기 위해서는 위의 isActive 로직이 필수임
    if (isActive) this.active()
    else this.deActive() // 이미 activated인 task를 deActive를 해야하는가?
    return this
  }

  async invoice(vendorInvoiceId: string, orderModificationValidator: OrderModificationValidator) {
    await orderModificationValidator.validate(this)
    this.props.vendorInvoiceId = vendorInvoiceId
    return this
  }

  async updateCost(
    calcService: CalculateVendorCostDomainService,
    expensePricing: ExpensePricingEntity,
    orderedService: OrderedServiceEntity,
    orderModificationValidator: OrderModificationValidator,
  ) {
    await orderModificationValidator.validate(this)
    this.props.cost = calcService.calcVendorCost(expensePricing, orderedService)
  }

  // residential revision은 size가 정해지지 않은 경우 complete 될 수 없음
  async complete(orderModificationValidator: OrderModificationValidator): Promise<this> {
    await orderModificationValidator.validate(this)
    this.props.status = AssignedTaskStatusEnum.Completed
    this.props.doneAt = new Date()
    this.addEvent(
      new AssignedTaskCompletedDomainEvent({
        aggregateId: this.id,
        orderedServiceId: this.props.orderedServiceId,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  async cancel(orderModificationValidator: OrderModificationValidator): Promise<this> {
    await orderModificationValidator.validate(this)
    this.props.status = AssignedTaskStatusEnum.Canceled
    this.props.doneAt = new Date()
    // this.deActive()
    return this
  }

  async hold(orderModificationValidator: OrderModificationValidator): Promise<this> {
    await orderModificationValidator.validate(this)
    if (this.isCompleted || this.isCanceled) {
      return this
    }
    this.props.status = AssignedTaskStatusEnum.On_Hold
    return this
  }

  async reset(orderModificationValidator: OrderModificationValidator): Promise<this> {
    await orderModificationValidator.validate(this)
    this.props.status = AssignedTaskStatusEnum.Not_Started
    this.props.doneAt = null
    this.props.assigneeId = null
    this.props.assigneeName = null
    this.props.startedAt = null
    return this
  }

  async unassign(orderModificationValidator: OrderModificationValidator) {
    if (this.isCompleted) throw new AssignedTaskAlreadyCompletedException()
    await orderModificationValidator.validate(this)
    this.props.assigneeId = null
    this.props.assigneeName = null
    this.props.assigneeOrganizationId = null
    this.props.assigneeOrganizationName = null
    this.props.status = AssignedTaskStatusEnum.Not_Started
    this.props.startedAt = null
    this.props.doneAt = null
    return this
  }

  async assign(user: UserEntity, orderModificationValidator: OrderModificationValidator): Promise<this> {
    await orderModificationValidator.validate(this)
    this.props.assigneeId = user.id
    this.props.assigneeName = user.userName.fullName
    this.props.assigneeOrganizationId = user.organization.id
    this.props.assigneeOrganizationName = user.organization.name
    this.props.status = AssignedTaskStatusEnum.In_Progress
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
        orderedServiceId: this.props.orderedServiceId,
      }),
    )
    return this
  }

  async setDuration(duration: number | null, orderModificationValidator: OrderModificationValidator): Promise<this> {
    await orderModificationValidator.validate(this)
    if (duration && duration > 127) {
      throw new AssignedTaskDurationExceededException()
    }
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
