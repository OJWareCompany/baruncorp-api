import { OrganizationEntity } from '../../organization/domain/organization.entity'
import { ExpensePricingEntity } from './expense-pricing.entity'

export class ExpensePricingDomainService {
  isValidForCreation(organization: OrganizationEntity, expensePricing: ExpensePricingEntity) {
    return (
      organization.id === expensePricing.getProps().organizationId &&
      organization.getProps().organizationType !== 'administration'
    )
  }
}
