import { CustomCommercialNewServicePricingTier } from './value-objects/custom-commercial-new-service-tier.value-object'
import { CustomFixedPrice } from './value-objects/custom-fixed-pricing.value-object'
import { CustomResidentialNewServicePricingTier } from './value-objects/custom-residential-new-servier-tier.value-object'
import { CustomResidentialRevisionPricing } from './value-objects/custom-residential-revision-pricing.value-object'

export interface CreateCustomPricingProps {
  serviceId: string
  serviceName: string
  oragnizationId: string
  organizationName: string
  residentialNewServiceTiers: CustomResidentialNewServicePricingTier[]
  residentialRevisionPricing: CustomResidentialRevisionPricing | null
  commercialNewServiceTiers: CustomCommercialNewServicePricingTier[]
  fixedPricing: CustomFixedPrice | null
}

export type CustomPricingProps = CreateCustomPricingProps
