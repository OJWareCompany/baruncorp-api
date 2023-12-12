import { Injectable } from '@nestjs/common'
import { ExpensePricingEntity } from '../../expense-pricing/domain/expense-pricing.entity'
import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { ProjectPropertyTypeEnum } from '../../project/domain/project.type'

@Injectable()
export class CalculateVendorCostDomainService {
  calcVendorCost(expensePricing: ExpensePricingEntity, orderedService: OrderedServiceEntity): number {
    return orderedService.isRevision
      ? this.calcForRevision(expensePricing, orderedService)
      : this.calcForNew(expensePricing, orderedService)
  }

  private calcForRevision(expensePricing: ExpensePricingEntity, orderedService: OrderedServiceEntity) {
    return orderedService.projectPropertyType === ProjectPropertyTypeEnum.Residential
      ? expensePricing.calcResidentialRevisionCost(orderedService.price)
      : expensePricing.calcCommerciallRevisionCost(orderedService.price)
  }

  private calcForNew(expensePricing: ExpensePricingEntity, orderedService: OrderedServiceEntity) {
    return orderedService.projectPropertyType === ProjectPropertyTypeEnum.Residential
      ? expensePricing.calcResidentialNewCost(orderedService.price)
      : expensePricing.calcCommerciallNewCost(orderedService.price)
  }
}
