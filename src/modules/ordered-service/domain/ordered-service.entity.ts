import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  CreateOrderedServiceProps,
  OrderedServiceProps,
  OrderedServiceSizeForRevisionEnum,
  OrderedServiceStatusEnum,
} from './ordered-service.type'
import { OrderedServiceCreatedDomainEvent } from './events/ordered-service-created.domain-event'
import {
  OrderedServiceAlreadyCompletedException,
  OrderedServiceFreeRevisionManualPriceUpdateException,
  OrderedServiceInvalidRevisionSizeForManualPriceUpdateException,
} from './ordered-service.error'
import { OrderedServiceCanceledDomainEvent } from './events/ordered-service-canceled.domain-event'
import { OrderedServiceReactivatedDomainEvent } from './events/ordered-service-reactivated.domain-event'
import { OrderedServiceCompletedDomainEvent } from './events/ordered-service-completed.domain-event'
import { Service } from '@prisma/client'
import { OrderedServiceUpdatedRevisionSizeDomainEvent } from './events/ordered-service-updated-revision-size.domain-event'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { CalculateInvoiceService } from '../../invoice/domain/calculate-invoice-service.domain-service'
import { CustomPricingRepositoryPort } from '../../custom-pricing/database/custom-pricing.repository.port'
import { OrderedServiceAppliedTieredPricingDomainEvent } from './events/ordered-service-invoiced.domain-event'
import { ServiceInitialPriceManager } from './ordered-service-manager.domain-service'
import { OrderedServicePriceUpdatedDomainEvent } from './events/ordered-service-price-updated.domain-event'
import { OrderedServiceCompletionCheckDomainService } from './domain-services/check-all-related-tasks-completed.domain-service'
import { TaskStatusChangeValidationDomainService } from '../../assigned-task/domain/domain-services/task-status-change-validation.domain-service'
import { RevisionTypeUpdateValidationDomainService } from './domain-services/revision-type-update-validation.domain-service'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static async create(
    create: CreateOrderedServiceProps,
    calcService: ServiceInitialPriceManager,
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    const id = v4()
    const props: OrderedServiceProps = {
      ...create,
      priceOverride: null,
      status: 'Pending',
      doneAt: null,
      orderedAt: new Date(),
      isManualPrice: false,
      assignedTasks: [],
      price: null,
      sizeForRevision: null,
    }

    const entity = new OrderedServiceEntity({ id, props })

    await entity.determineInitialValues(calcService, taskStatusValidator, revisionTypeUpdateValidator)

    entity.addEvent(
      new OrderedServiceCreatedDomainEvent({
        aggregateId: entity.id,
        ...props,
      }),
    )

    return entity
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

  private async determineInitialValues(
    calcService: ServiceInitialPriceManager,
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    if (this.isRevision) {
      await this.determineInitialRevisionType(calcService, taskStatusValidator, revisionTypeUpdateValidator)
    } else {
      await taskStatusValidator.validate(this)
      const initialPrice = await calcService.determinePrice(this, this.sizeForRevision)
      this.setPrice(initialPrice)
    }
  }

  private async determineInitialRevisionType(
    calcService: ServiceInitialPriceManager,
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    const revisionSize = await calcService.determineInitialRevisionSize(this)
    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      await this.updateRevisionSizeToMajor(taskStatusValidator, calcService, revisionTypeUpdateValidator)
    } else if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      await this.updateRevisionSizeToMinor(taskStatusValidator, revisionTypeUpdateValidator)
    }
  }

  async cleanRevisionSize(
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    await taskStatusValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)

    this.props.sizeForRevision = null
    this.props.price = null
    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  async updateRevisionSizeToMinor(
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {
    await taskStatusValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)

    this.props.sizeForRevision = OrderedServiceSizeForRevisionEnum.Minor
    this.freeCost()
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
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    calcService: ServiceInitialPriceManager,
    revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ): Promise<this> {
    await taskStatusValidator.validate(this)
    await revisionTypeUpdateValidator.validate(this)
    this.props.sizeForRevision = OrderedServiceSizeForRevisionEnum.Major

    const initialPrice = await calcService.determinePrice(this, this.sizeForRevision)

    this.setPrice(initialPrice)

    this.addEvent(
      new OrderedServiceUpdatedRevisionSizeDomainEvent({
        aggregateId: this.id,
        jobId: this.props.jobId,
      }),
    )
    return this
  }

  cancel(): this {
    if (this.props.status === 'Completed') return this
    this.props.status = 'Canceled'
    this.props.doneAt = new Date()
    this.addEvent(
      new OrderedServiceCanceledDomainEvent({
        aggregateId: this.id,
      }),
    )
    this.freeCost()
    return this
  }

  reactivate(): this {
    if (this.props.status === 'Completed') throw new OrderedServiceAlreadyCompletedException()
    this.props.status = 'Pending'
    this.props.doneAt = null
    this.addEvent(
      new OrderedServiceReactivatedDomainEvent({
        aggregateId: this.id,
      }),
    )
    return this
  }

  async validateAndComplete(completionChecker: OrderedServiceCompletionCheckDomainService) {
    if (this.isRevision && !this.isRevisionTypeEntered) return
    const isAllCompleted = await completionChecker.isAllRelatedTasksCompleted(this)
    if (!isAllCompleted) return
    this.complete()
    return this
  }

  private complete(): this {
    this.props.status = 'Completed'
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
    taskStatusValidator: TaskStatusChangeValidationDomainService,
    price: number,
  ) {
    await taskStatusValidator.validate(this)

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
