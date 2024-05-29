import { Service } from '@prisma/client'
import { v4 } from 'uuid'
import _ from 'lodash'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { JobCanceledAndKeptInvoiceDomainEvent } from '../../ordered-job/domain/events/job-canceled-and-kept-invoice.domain-event'
import { OrderModificationValidator } from '../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { JobCanceledDomainEvent } from '../../ordered-job/domain/events/job-canceled.domain-event'
import { OrderDeletionValidator } from '../../ordered-job/domain/domain-services/order-deletion-validator.domain-service'
import {
  JobSendableToClientPriceNotSetException,
  JobSendableToClientScopesInCompletedException,
} from '../../ordered-job/domain/job.error'
import { OrderedServiceCanceledAndKeptInvoiceDomainEvent } from './events/ordered-service-canceled-and-ketp-invoice.domain-event'
import { OrderedServiceAppliedTieredPricingDomainEvent } from './events/ordered-service-invoiced.domain-event'
import { OrderedServiceUpdatedRevisionSizeDomainEvent } from './events/ordered-service-updated-revision-size.domain-event'
import { RevisionTypeUpdateValidationDomainService } from './domain-services/revision-type-update-validation.domain-service'
import { OrderedServiceBackToNotStartedDomainEvent } from './events/ordered-service-back-to-not-started.domain-event'
import { OrderedServicePriceUpdatedDomainEvent } from './events/ordered-service-price-updated.domain-event'
import { OrderedServiceCompletedDomainEvent } from './events/ordered-service-completed.domain-event'
import { OrderedServiceCanceledDomainEvent } from './events/ordered-service-canceled.domain-event'
import { OrderedServiceCreatedDomainEvent } from './events/ordered-service-created.domain-event'
import { OrderedServiceDeletedDomainEvent } from './events/ordered-service-deleted.domain-event'
import { OrderedServiceStartedDomainEvent } from './events/ordered-service-started.domain-event'
import { OrderedServiceHeldDomainEvent } from './events/ordered-service-held.domain-event'
import { ServiceInitialPriceManager } from './ordered-service-manager.domain-service'
import { TieredPricingCalculator } from './domain-services/tiered-pricing-calculator.domain-service'
import { ScopeRevisionChecker } from './domain-services/scope-revision-checker.domain-service'
import {
  AutoOnlyOrderedServiceStatusEnum,
  CreateOrderedServiceProps,
  OrderedScopeStatus,
  OrderedServicePricingTypeEnum,
  OrderedServiceProps,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from './ordered-service.type'
import {
  OrderedScopeConflictException,
  OrderedServiceFreeRevisionManualPriceUpdateException,
  OrderedServiceInvalidRevisionSizeForManualPriceUpdateException,
  OrderedServiceRevisionTypeNotEnteredException,
} from './ordered-service.error'
import { DuplicatedScopeChecker } from './domain-services/duplicated-scope-checker.domain-service'
import { OrderedServiceStatusUpdatedDomainEvent } from './events/ordered-service-status-updated.domain-event'
import { DetermineOrderedServiceStatus } from './domain-services/determine-ordered-service-status.domain-service'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static async create(
    create: CreateOrderedServiceProps,
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
    scopeRevisionChecker: ScopeRevisionChecker,
    duplicatedScopeChecker: DuplicatedScopeChecker,
    tieredPricingCalculator: TieredPricingCalculator,
  ) {
    const id = v4()
    const props: OrderedServiceProps = {
      ...create,
      priceOverride: null,
      status: OrderedServiceStatusEnum.Not_Started,
      doneAt: null,
      orderedAt: new Date(),
      isManualPrice: false,
      assignedTasks: [],
      price: null,
      sizeForRevision: null,
      pricingType: null,
      isRevision: false,
    }

    const entity = new OrderedServiceEntity({ id, props })
    if (await duplicatedScopeChecker.isDuplicated(entity)) {
      throw new OrderedScopeConflictException()
    }

    if (entity.props.serviceName === 'Other') {
      entity.props.isRevision = create.isRevision
    } else {
      entity.props.isRevision = await scopeRevisionChecker.isRevision(entity)
    }

    await entity.determineInitialValues(
      calcService,
      orderModificationValidator,
      revisionTypeUpdateValidator,
      tieredPricingCalculator,
    )

    entity.addEvent(
      new OrderedServiceCreatedDomainEvent({
        aggregateId: entity.id,
        ...props,
        editorUserId: entity.getProps().editorUserId,
      }),
    )

    return entity
  }

  get status() {
    return this.props.status
  }

  get sizeForRevision() {
    return this.props.sizeForRevision
  }

  get projectId() {
    return this.props.projectId
  }

  get serviceId() {
    return this.props.serviceId
  }

  get mountingType() {
    return this.props.mountingType
  }

  get price() {
    return this.props.price
  }

  get jobId() {
    return this.props.jobId
  }

  get isGroundMount() {
    return this.props.mountingType === MountingTypeEnum.Ground_Mount
  }

  get isRoofMount() {
    return this.props.mountingType === MountingTypeEnum.Roof_Mount
  }

  get organizationId() {
    return this.props.organizationId
  }

  get orderedAt(): Date {
    return this.props.orderedAt
  }

  get isRevision() {
    return this.props.isRevision
  }

  get isRevisionTypeEntered() {
    return this.props.isRevision && this.props.sizeForRevision !== null
  }

  get isResidentialRevision() {
    return this.props.isRevision && this.props.projectPropertyType === ProjectPropertyTypeEnum.Residential
  }

  get projectPropertyType() {
    return this.props.projectPropertyType
  }

  async delete(modificationValidator: OrderModificationValidator, deletionValidator: OrderDeletionValidator) {
    await deletionValidator.validate(this)
    await modificationValidator.validate(this)
    this.addEvent(
      new OrderedServiceDeletedDomainEvent({
        aggregateId: this.id,
        jobId: this.jobId,
        editorUserId: this.props.editorUserId,
        deletedAt: new Date(),
      }),
    )
    return this
  }

  isSendableOrThrow() {
    const invalidStatus = [
      AutoOnlyOrderedServiceStatusEnum.On_Hold,
      OrderedServiceStatusEnum.Not_Started,
      OrderedServiceStatusEnum.In_Progress,
    ]
    const isInvalid = invalidStatus.includes(this.props.status)
    if (isInvalid) throw new JobSendableToClientScopesInCompletedException()

    if (this.props.price === null) throw new JobSendableToClientPriceNotSetException()
  }

  async setProjectPropertyType(
    projectPropertyType: ProjectPropertyTypeEnum,
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
    tieredPricingCalculator: TieredPricingCalculator,
  ) {
    this.props.projectPropertyType = projectPropertyType
    await this.determineInitialValues(
      calcService,
      orderModificationValidator,
      revisionTypeUpdateValidator,
      tieredPricingCalculator,
    )
    return this
  }

  async determineInitialValues(
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
    tieredPricingCalculator: TieredPricingCalculator,
  ) {
    if (this.isRevision) {
      await this.determineInitialRevisionType(
        calcService,
        orderModificationValidator,
        revisionTypeUpdateValidator,
        tieredPricingCalculator,
      )
    } else {
      await orderModificationValidator.validate(this)
      const initialValue = await calcService.determinePriceAndPricingType(
        this,
        this.sizeForRevision,
        tieredPricingCalculator,
      )
      this.setPricingType(initialValue?.pricingType || null)
      const isTieredPricing =
        initialValue?.pricingType === OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_NEW_PRICE ||
        initialValue?.pricingType === OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_GM_PRICE
      if (isTieredPricing) {
        await this.setTieredPrice(tieredPricingCalculator)
      } else {
        this.setPrice(initialValue?.price || null, { isManually: false })
      }
    }
  }

  private async determineInitialRevisionType(
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
    tieredPricingCalculator: TieredPricingCalculator,
  ) {
    const revisionSize = await calcService.determineInitialRevisionSize(this)
    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      await this.updateRevisionSizeToMajor(
        orderModificationValidator,
        calcService,
        revisionTypeUpdateValidator,
        tieredPricingCalculator,
      )
    } else if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      await this.updateRevisionSizeToMinor(orderModificationValidator, revisionTypeUpdateValidator)
    } else {
      const initialValue = await calcService.determinePriceAndPricingType(
        this,
        this.sizeForRevision,
        tieredPricingCalculator,
      )
      this.setPrice(initialValue?.price || null, { isManually: false })
      this.setPricingType(initialValue?.pricingType || null)
    }
  }

  async cleanRevisionSize(
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    await orderModificationValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)

    this.props.sizeForRevision = null
    this.props.price = null
    this.props.pricingType = null
    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  async updateRevisionSizeToMinor(
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    await orderModificationValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)

    this.props.sizeForRevision = OrderedServiceSizeForRevisionEnum.Minor
    this.freeCost()
    this.setPricingType(OrderedServicePricingTypeEnum.BASE_MINOR_REVISION_FREE)
    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  // TODO: 그냥 처음부터 revision price 입력해놓고, 인보이스에서 0원으로 바꾸는게 나을지도 모르겠다.
  async updateRevisionSizeToMajor(
    orderModificationValidator: OrderModificationValidator,
    calcService: ServiceInitialPriceManager,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
    tieredPricingCalculator: TieredPricingCalculator,
  ): Promise<this> {
    await orderModificationValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)
    this.props.sizeForRevision = OrderedServiceSizeForRevisionEnum.Major

    const initialValue = await calcService.determinePriceAndPricingType(
      this,
      this.sizeForRevision,
      tieredPricingCalculator,
    )
    this.setPrice(initialValue?.price || null, { isManually: false })
    this.setPricingType(initialValue?.pricingType || null)

    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  async setTieredPrice(tieredPricingCalculator: TieredPricingCalculator): Promise<this> {
    if (this.props.isManualPrice) return this
    if (await tieredPricingCalculator.isTieredPricingScope(this)) {
      const price = await tieredPricingCalculator.calc(this)
      this.setPrice(price, { isManually: false })
      this.addEvent(
        new OrderedServiceAppliedTieredPricingDomainEvent({
          aggregateId: this.id,
          jobId: this.props.jobId,
        }),
      )
    }
    return this
  }

  /**
   * 코드를 보고 manual price를 입력할때 필요한 도메인 프로세스를 쉽게 파악할수 있도록 문서같은 코드가 되어야한다.
   */
  async setManualPrice(
    serviceInitialPriceManager: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    price: number,
  ) {
    await orderModificationValidator.validate(this)

    if (this.isResidentialRevision && this.sizeForRevision !== 'Major') {
      throw new OrderedServiceInvalidRevisionSizeForManualPriceUpdateException()
    }

    const isFreeRevision = await serviceInitialPriceManager.isFreeRevision(this)
    if (isFreeRevision) {
      throw new OrderedServiceFreeRevisionManualPriceUpdateException()
    }

    this.props.isManualPrice = true
    this.setPrice(price, { isManually: true })
  }

  setDescription(description: string | null): this {
    this.props.description = description
    return this
  }

  private freeCost() {
    if (this.props.sizeForRevision === OrderedServiceSizeForRevisionEnum.Major) return this
    const NO_COST = 0
    this.setPrice(NO_COST, { isManually: false })
    return this
  }

  private setPricingType(pricingType: OrderedServicePricingTypeEnum | null): this {
    this.props.pricingType = pricingType
    return this
  }

  private setPrice(price: number | null, option: { isManually: boolean }): void {
    if (this.props.isManualPrice && !option.isManually) {
      return
    }
    this.props.price = price
    this.addEvent(
      new OrderedServicePriceUpdatedDomainEvent({
        aggregateId: this.id,
        jobId: this.jobId,
      }),
    )
  }

  setPriceForCommercialRevision(hoursWorked: number, service: Service): this {
    if (this.props.isManualPrice || this.props.projectPropertyType !== ProjectPropertyTypeEnum.Commercial) return this

    const price = this.calculateCost(
      hoursWorked,
      Number(service.commercialRevisionMinutesPerUnit) + Number.EPSILON,
      Number(service.commercialRevisionCostPerUnit) + Number.EPSILON,
    )
    this.setPrice(price, { isManually: false })
    return this
  }

  private calculateCost(hoursWorked: number, minutesPerUnit: number, costPerUnit: number): number {
    // 작업 시간을 단위 시간으로 나누어 필요한 단위의 수를 계산합니다.
    const units: number = (hoursWorked * 60) / minutesPerUnit
    const totalCost: number = units * costPerUnit
    return totalCost
  }

  async determineStatus(determineOrderedServiceStatus: DetermineOrderedServiceStatus): Promise<void> {
    const status = await determineOrderedServiceStatus.determine(this)

    if (this.props.status === status) {
      throw new Error()
    }

    if (status === OrderedServiceStatusEnum.Completed) {
      this.validateAndComplete()
    }

    if (status === OrderedServiceStatusEnum.Not_Started) {
      this.backToNotStarted({ invokedBy: 'task' })
    }

    if (status === OrderedServiceStatusEnum.In_Progress) {
      this.start()
    }

    if (status === AutoOnlyOrderedServiceStatusEnum.On_Hold) {
      // 태스크를 취소하는 것이 아닌, Scope를 On Hold 하도록 한다.
    }

    if (status === OrderedServiceStatusEnum.Canceled) {
      /**
       * 태스크를 취소하는 것이 아닌, Scope를 Canceled 하도록 한다.
       * 1. 태스크가 전부 취소 상태일 때 인보이스 여부를 알 수 없다.
       */
    }
  }

  private setStatus(status: OrderedServiceStatusEnum | AutoOnlyOrderedServiceStatusEnum) {
    this.props.status = status
    this.addEvent(new OrderedServiceStatusUpdatedDomainEvent({ aggregateId: this.id }))

    switch (this.props.status) {
      case OrderedServiceStatusEnum.Not_Started:
        this.addEvent(
          new OrderedServiceBackToNotStartedDomainEvent({
            aggregateId: this.id,
          }),
        )
        break

      case OrderedServiceStatusEnum.In_Progress:
        this.addEvent(
          new OrderedServiceStartedDomainEvent({
            aggregateId: this.id,
            jobId: this.jobId,
          }),
        )
        break

      case OrderedServiceStatusEnum.Completed:
        this.addEvent(
          new OrderedServiceCompletedDomainEvent({
            aggregateId: this.id,
            jobId: this.props.jobId,
          }),
        )
        break

      case OrderedServiceStatusEnum.Canceled:
        this.addEvent(
          new OrderedServiceCanceledDomainEvent({
            aggregateId: this.id,
          }),
        )
        break

      case OrderedServiceStatusEnum.Canceled_Invoice:
        this.addEvent(
          new OrderedServiceCanceledAndKeptInvoiceDomainEvent({
            aggregateId: this.id,
          }),
        )
        break

      case AutoOnlyOrderedServiceStatusEnum.On_Hold:
        this.addEvent(
          new OrderedServiceHeldDomainEvent({
            aggregateId: this.id,
          }),
        )
        break
    }
  }

  cancel(option: JobCanceledDomainEvent | JobCanceledAndKeptInvoiceDomainEvent | 'manually'): this {
    const permittedAutoUpdateStatus = [
      OrderedServiceStatusEnum.In_Progress,
      OrderedServiceStatusEnum.Not_Started,
      AutoOnlyOrderedServiceStatusEnum.On_Hold,
    ]
    const isIncludedFromAutoUpdate = permittedAutoUpdateStatus.includes(this.props.status)
    if (option !== 'manually' && !isIncludedFromAutoUpdate) {
      // throw new OrderedServiceAutoCancelableException()
      return this
    }

    this.setStatus(OrderedServiceStatusEnum.Canceled)
    this.props.doneAt = new Date()
    this.freeCost()
    return this
  }

  cancelAndKeepInvoice() {
    this.setStatus(OrderedServiceStatusEnum.Canceled_Invoice)
    this.props.doneAt = null
    return this
  }

  isAssigned() {
    return this.props.assignedTasks.some((task) => !!task.assigneeId)
  }

  backToNotStarted(option: { invokedBy: 'job' | 'task' | 'manually' }): this {
    const permittedAutoUpdateStatusWhenInvokedByJob: OrderedScopeStatus[] = [
      // OrderedServiceStatusEnum.Canceled,
      AutoOnlyOrderedServiceStatusEnum.On_Hold,
    ]
    const isIncludedFromAutoUpdate = permittedAutoUpdateStatusWhenInvokedByJob.includes(this.props.status)
    if (option.invokedBy === 'job' && !isIncludedFromAutoUpdate) {
      return this
    }

    this.setStatus(OrderedServiceStatusEnum.Not_Started)
    this.props.doneAt = null
    return this
  }

  hold() {
    const invalidStatus = [
      OrderedServiceStatusEnum.Canceled,
      OrderedServiceStatusEnum.Canceled_Invoice,
      OrderedServiceStatusEnum.Completed,
      AutoOnlyOrderedServiceStatusEnum.On_Hold,
    ]

    if (invalidStatus.includes(this.props.status)) {
      // throw new OrderedServiceHoldableException()
      return
    }

    this.setStatus(AutoOnlyOrderedServiceStatusEnum.On_Hold)
    return this
  }

  start() {
    this.setStatus(OrderedServiceStatusEnum.In_Progress)
    return this
  }

  // async validateAndComplete(orderedScopeStatusChangeValidator: OrderedScopeStatusChangeValidator): Promise<this> {
  async validateAndComplete(): Promise<this> {
    if (this.isRevision && !this.isRevisionTypeEntered) {
      throw new OrderedServiceRevisionTypeNotEnteredException()
    }
    // await orderedScopeStatusChangeValidator.validate(this, OrderedServiceStatusEnum.Completed)
    this.complete()
    return this
  }

  private async complete(): Promise<this> {
    this.setStatus(OrderedServiceStatusEnum.Completed)
    this.props.doneAt = new Date()
    return this
  }

  async determinePriceWhenInvoice(tieredPricingCalculator: TieredPricingCalculator): Promise<this> {
    const permittedAutoUpdateStatus = [OrderedServiceStatusEnum.Completed, OrderedServiceStatusEnum.Canceled_Invoice]
    if (this.isCanceledOrMinorCompleted) return this.freeCost()
    if (!this.isNewResidentialPurePrice) return this
    if (!_.includes(permittedAutoUpdateStatus, this.status)) return this
    return await this.setTieredPrice(tieredPricingCalculator)
  }

  get isCanceledOrMinorCompleted(): boolean {
    return (
      this.props.status === OrderedServiceStatusEnum.Canceled ||
      (this.props.status === OrderedServiceStatusEnum.Completed &&
        this.props.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor)
    )
  }

  get isVolumeTieredPricing(): boolean {
    const isTieredPricing =
      this.props.pricingType === OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_NEW_PRICE ||
      this.props.pricingType === OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_GM_PRICE
    return (
      isTieredPricing &&
      this.props.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
      (this.props.status === OrderedServiceStatusEnum.Completed ||
        this.props.status === OrderedServiceStatusEnum.Canceled_Invoice) &&
      !this.props.isRevision
    )
  }

  get isNewResidentialPurePrice(): boolean {
    return (
      this.props.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
      (this.props.status === OrderedServiceStatusEnum.Completed ||
        this.props.status === OrderedServiceStatusEnum.Canceled_Invoice) &&
      !this.props.isRevision &&
      !this.props.isManualPrice
    )
  }

  public validate(): void {
    return
  }
}
