import { OrderedServiceStatusEnum } from '../ordered-service.type'

export class TieredPricingApplicableStatuses {
  private readonly tieredPricingApplicableStatuses = [
    OrderedServiceStatusEnum.Completed,
    OrderedServiceStatusEnum.Canceled_Invoice,
  ]

  get value(): OrderedServiceStatusEnum[] {
    return this.tieredPricingApplicableStatuses
  }
}
