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
  OrderedServiceInvalidRevisionStateException,
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
import { ServiceEntity } from '../../service/domain/service.entity'
import { JobEntity } from '../../ordered-job/domain/job.entity'
import { OrganizationEntity } from '../../organization/domain/organization.entity'
import { CustomPricingEntity } from '../../custom-pricing/domain/custom-pricing.entity'
import { OrderedServicePriceUpdatedDomainEvent } from './events/ordered-service-price-updated.domain-event'

export class OrderedServiceEntity extends AggregateRoot<OrderedServiceProps> {
  protected _id: string

  static create(create: CreateOrderedServiceProps) {
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

  get projectPropertyType() {
    return this.props.projectPropertyType
  }

  determineInitialValues(
    calcService: ServiceInitialPriceManager,
    service: ServiceEntity,
    organization: OrganizationEntity,
    job: JobEntity,
    previouslyOrderedServices: OrderedServiceEntity[],
    customPricing: CustomPricingEntity | null,
  ) {
    const revisionSize = calcService.determineInitialRevisionSize(
      this,
      previouslyOrderedServices,
      organization,
      service,
      customPricing,
    )

    const initialPrice = calcService.determinePrice(
      revisionSize,
      previouslyOrderedServices,
      service,
      organization,
      job,
      customPricing,
    )

    this.setPrice(initialPrice)
    if (revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      this.updateRevisionSizeToMajor(calcService, service, organization, job, previouslyOrderedServices, customPricing)
    } else if (revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      this.updateRevisionSizeToMinor()
    }
    return this
  }

  updateRevisionSizeToMinor() {
    if (!this.props.isRevision) throw new OrderedServiceInvalidRevisionStateException()
    this.props.sizeForRevision = OrderedServiceSizeForRevisionEnum.Minor
    this.freeCost()
    return this
  }

  // TODO: 그냥 처음부터 revision price 입력해놓고, 인보이스에서 0원으로 바꾸는게 나을지도 모르겠다.
  updateRevisionSizeToMajor(
    calcService: ServiceInitialPriceManager,
    service: ServiceEntity,
    organization: OrganizationEntity,
    job: JobEntity,
    previouslyOrderedServices: OrderedServiceEntity[],
    customPricing: CustomPricingEntity | null,
  ): this {
    if (!this.props.isRevision) throw new OrderedServiceInvalidRevisionStateException()
    const revisionSize = OrderedServiceSizeForRevisionEnum.Major
    const initialPrice = calcService.determinePrice(
      revisionSize,
      previouslyOrderedServices,
      service,
      organization,
      job,
      customPricing,
    )

    this.props.sizeForRevision = revisionSize
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

  complete(): this {
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

  setManualPrice(price: number) {
    this.props.isManualPrice = true
    this.setPrice(price)
  }

  setDescription(description: string | null): this {
    this.props.description = description
    return this
  }

  private freeCost() {
    const NO_COST = 0
    if (this.isCanceledOrMinorCompleted) this.setPrice(NO_COST)
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
    if (this.props.isManualPrice) return this

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
