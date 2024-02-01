import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  AutoOnlyOrderedServiceStatusEnum,
  CreateOrderedServiceProps,
  OrderedServicePricingTypeEnum,
  OrderedServiceProps,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from './ordered-service.type'
import { OrderedServiceCreatedDomainEvent } from './events/ordered-service-created.domain-event'
import {
  OrderedServiceAutoCancelableException,
  OrderedServiceFreeRevisionManualPriceUpdateException,
  OrderedServiceHoldableException,
  OrderedServiceInvalidRevisionSizeForManualPriceUpdateException,
  OrderedServiceAutoStartableException,
} from './ordered-service.error'
import { OrderedServiceCanceledDomainEvent } from './events/ordered-service-canceled.domain-event'
import { OrderedServiceCompletedDomainEvent } from './events/ordered-service-completed.domain-event'
import { Service } from '@prisma/client'
import { OrderedServiceUpdatedRevisionSizeDomainEvent } from './events/ordered-service-updated-revision-size.domain-event'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { CalculateInvoiceService } from '../../invoice/domain/calculate-invoice-service.domain-service'
import { CustomPricingRepositoryPort } from '../../custom-pricing/database/custom-pricing.repository.port'
import { OrderedServiceAppliedTieredPricingDomainEvent } from './events/ordered-service-invoiced.domain-event'
import { ServiceInitialPriceManager } from './ordered-service-manager.domain-service'
import { OrderedServicePriceUpdatedDomainEvent } from './events/ordered-service-price-updated.domain-event'
import { OrderedScopeStatusChangeValidator } from './domain-services/check-all-related-tasks-completed.domain-service'
import { OrderModificationValidator } from '../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { RevisionTypeUpdateValidationDomainService } from './domain-services/revision-type-update-validation.domain-service'
import {
  JobSendableToClientPriceNotSetException,
  JobSendableToClientScopesInCompletedException,
} from '../../ordered-job/domain/job.error'
import { OrderedServiceBackToNotStartedDomainEvent } from './events/ordered-service-back-to-not-started.domain-event'
import { OrderedServiceCanceledAndKeptInvoiceDomainEvent } from './events/ordered-service-canceled-and-ketp-invoice.domain-event'
import { OrderedServiceHeldDomainEvent } from './events/ordered-service-held.domain-event'
import { OrderedServiceStartedDomainEvent } from './events/ordered-service-started.domain-event'
import { OrderedServiceResetDomainEvent } from './events/ordered-service-reset.domain-event'
import { JobCanceledDomainEvent } from '../../ordered-job/domain/events/job-canceled.domain-event'
import { JobCanceledAndKeptInvoiceDomainEvent } from '../../ordered-job/domain/events/job-canceled-and-kept-invoice.domain-event'
import { JobNotStartedDomainEvent } from '../../ordered-job/domain/events/job-not-started.domain-event'
import { JobStartedDomainEvent } from '../../ordered-job/domain/events/job-started.domain-event'
import { OrderedServiceDeletedDomainEvent } from './events/ordered-service-deleted.domain-event'
import { OrderDeletionValidator } from '../../ordered-job/domain/domain-services/order-deletion-validator.domain-service'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static async create(
    create: CreateOrderedServiceProps,
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
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
    }

    const entity = new OrderedServiceEntity({ id, props })

    await entity.determineInitialValues(calcService, orderModificationValidator, revisionTypeUpdateValidator)

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

  private async determineInitialValues(
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    if (this.isRevision) {
      await this.determineInitialRevisionType(calcService, orderModificationValidator, revisionTypeUpdateValidator)
    } else {
      await orderModificationValidator.validate(this)
      const initialValue = await calcService.determinePriceAndPricingType(this, this.sizeForRevision)
      this.setPrice(initialValue?.price || null)
      this.setPricingType(initialValue?.pricingType || null)
    }
  }

  private async determineInitialRevisionType(
    calcService: ServiceInitialPriceManager,
    orderModificationValidator: OrderModificationValidator,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    const revisionSize = await calcService.determineInitialRevisionSize(this)
    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      await this.updateRevisionSizeToMajor(orderModificationValidator, calcService, revisionTypeUpdateValidator)
    } else if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      await this.updateRevisionSizeToMinor(orderModificationValidator, revisionTypeUpdateValidator)
    } else {
      const initialValue = await calcService.determinePriceAndPricingType(this, this.sizeForRevision)
      this.setPrice(initialValue?.price || null)
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
  ): Promise<this> {
    await orderModificationValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)
    this.props.sizeForRevision = OrderedServiceSizeForRevisionEnum.Major

    const initialValue = await calcService.determinePriceAndPricingType(this, this.sizeForRevision)
    this.setPrice(initialValue?.price || null)
    this.setPricingType(initialValue?.pricingType || null)

    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
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

    this.props.status = OrderedServiceStatusEnum.Canceled
    this.props.doneAt = new Date()
    this.addEvent(
      new OrderedServiceCanceledDomainEvent({
        aggregateId: this.id,
      }),
    )
    this.freeCost()
    return this
  }

  cancelAndKeepInvoice() {
    this.props.status = OrderedServiceStatusEnum.Canceled_Invoice
    this.props.doneAt = null
    this.addEvent(
      new OrderedServiceCanceledAndKeptInvoiceDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  backToNotStarted(option: JobNotStartedDomainEvent | JobStartedDomainEvent | 'manually'): this {
    const permittedAutoUpdateStatus = [OrderedServiceStatusEnum.Canceled, AutoOnlyOrderedServiceStatusEnum.On_Hold]
    const isIncludedFromAutoUpdate = permittedAutoUpdateStatus.includes(this.props.status)
    if (option !== 'manually' && !isIncludedFromAutoUpdate) {
      // throw new OrderedServiceAutoStartableException()
      return this
    }
    this.props.status = OrderedServiceStatusEnum.Not_Started
    this.props.doneAt = null
    this.addEvent(
      new OrderedServiceBackToNotStartedDomainEvent({
        aggregateId: this.id,
      }),
    )
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
      throw new OrderedServiceHoldableException()
    }

    this.props.status = AutoOnlyOrderedServiceStatusEnum.On_Hold
    this.addEvent(
      new OrderedServiceHeldDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  start() {
    this.props.status = OrderedServiceStatusEnum.In_Progress
    this.addEvent(
      new OrderedServiceStartedDomainEvent({
        aggregateId: this.id,
        jobId: this.jobId,
      }),
    )
    return this
  }

  reset() {
    this.props.status = OrderedServiceStatusEnum.Not_Started
    this.props.sizeForRevision = null
    // this.props.price = null

    this.addEvent(
      new OrderedServiceResetDomainEvent({
        aggregateId: this.id,
      }),
    )
    return 1
  }

  async validateAndComplete(orderedScopeStatusChangeValidator: OrderedScopeStatusChangeValidator) {
    if (this.isRevision && !this.isRevisionTypeEntered) return
    await orderedScopeStatusChangeValidator.validate(this, OrderedServiceStatusEnum.Completed)
    this.complete()
    return this
  }

  private async complete(): Promise<this> {
    this.props.status = OrderedServiceStatusEnum.Completed
    this.props.doneAt = new Date()
    this.addEvent(
      new OrderedServiceCompletedDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
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
    this.setPrice(price)
  }

  setDescription(description: string | null): this {
    this.props.description = description
    return this
  }

  private freeCost() {
    const NO_COST = 0
    // 왜 Minor Completed로 했었을까? 도메인 정보를 문서화 할 필요가 있다.
    // if (this.isCanceledOrMinorCompleted) this.setPrice(NO_COST)
    if (this.props.sizeForRevision !== OrderedServiceSizeForRevisionEnum.Major) this.setPrice(NO_COST)
  }

  private setPricingType(pricingType: OrderedServicePricingTypeEnum | null): this {
    this.props.pricingType = pricingType
    return this
  }

  private setPrice(price: number | null): void {
    this.props.price = price
    this.addEvent(
      new OrderedServicePriceUpdatedDomainEvent({
        aggregateId: this.id,
        jobId: this.jobId,
      }),
    )
  }

  setPriceForCommercialRevision(minutesWorked: number, service: Service): this {
    if (this.props.isManualPrice || this.props.projectPropertyType !== ProjectPropertyTypeEnum.Commercial) return this

    const price = this.calculateCost(
      minutesWorked,
      Number(service.commercialRevisionMinutesPerUnit) + Number.EPSILON,
      Number(service.commercialRevisionCostPerUnit) + Number.EPSILON,
    )
    this.setPrice(price)
    return this
  }

  private calculateCost(minutesWorked: number, minutesPerUnit: number, costPerUnit: number): number {
    // 작업 시간을 단위 시간으로 나누어 필요한 단위의 수를 계산합니다.
    const units: number = minutesWorked / minutesPerUnit

    // 필요한 단위의 수를 반올림하여 총 비용을 계산합니다.
    const totalCost: number = Math.round(units) * costPerUnit

    return totalCost
  }

  async determinePriceWhenInvoice(
    calcService: CalculateInvoiceService,
    orderedServices: OrderedServiceEntity[],
    customPricingRepo: CustomPricingRepositoryPort,
  ) {
    if (this.isCanceledOrMinorCompleted) return this.freeCost()
    if (!this.isNewResidentialPurePrice) return

    const tier = await calcService.getTier(this, orderedServices, customPricingRepo)
    if (!tier) return

    const price = this.isGroundMount ? tier.gmPrice : tier.price
    this.setPrice(price)
    this.addEvent(
      new OrderedServiceAppliedTieredPricingDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
  }

  get isCanceledOrMinorCompleted(): boolean {
    return (
      this.props.status === OrderedServiceStatusEnum.Canceled ||
      (this.props.status === OrderedServiceStatusEnum.Completed &&
        this.props.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor)
    )
  }

  get isNewResidentialService(): boolean {
    return (
      this.props.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
      this.props.status === OrderedServiceStatusEnum.Completed &&
      !this.props.isRevision
    )
  }

  get isNewResidentialPurePrice(): boolean {
    return (
      this.props.projectPropertyType === ProjectPropertyTypeEnum.Residential &&
      this.props.status === OrderedServiceStatusEnum.Completed &&
      !this.props.isRevision &&
      !this.props.isManualPrice
    )
  }

  public validate(): void {
    return
  }
}
