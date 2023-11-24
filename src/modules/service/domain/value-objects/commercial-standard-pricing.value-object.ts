import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { CommercialStandardPricingTier } from './commercial-standard-pricing-tier.value-object'
import { CommercialRevisionStandardPricing } from './commercial-revision-standard-pricing.value-object'

export interface CommercialStandardPricingProps {
  newServiceTiers: CommercialStandardPricingTier[]
  revision: CommercialRevisionStandardPricing
}

export class CommercialStandardPricing extends ValueObject<CommercialStandardPricingProps> {
  get newServiceTiers(): CommercialStandardPricingTier[] {
    return this.props.newServiceTiers
  }

  get revision(): CommercialRevisionStandardPricing {
    return this.props.revision
  }

  protected validate(props: CommercialStandardPricingProps): void {
    return
  }
}
