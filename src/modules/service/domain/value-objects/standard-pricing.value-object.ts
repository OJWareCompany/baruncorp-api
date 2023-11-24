import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { CommercialStandardPricing as CommercialStandardPricing } from './commercial-standard-pricing.value-object'
import { ResidentialStandardPricing } from './residential-standard-pricing.value-object'

export interface StandardPricingProps {
  residential: ResidentialStandardPricing | null
  commercial: CommercialStandardPricing | null
}

export class StandardPricing extends ValueObject<StandardPricingProps> {
  get residential(): ResidentialStandardPricing | null {
    return this.props.residential
  }

  get commercial(): CommercialStandardPricing | null {
    return this.props.commercial
  }

  protected validate(props: StandardPricingProps): void {
    return
  }
}

// new StandardPricing({
//   residential: new ResidentialStandardPricing({ price: 0, gmPrice: 0, revisionPrice: 0, revisionGmPrice: 0 }),
//   commercial: new CommercialStandardPricing({
//     newServiceTiers: [
//       new CommercialStandardPricingTier({ startingPoint: 0.01, finishingPoint: 100, price: 0 }),
//       new CommercialStandardPricingTier({ startingPoint: 100.01, finishingPoint: 200, price: 0 }),
//     ],
//     revision: new CommercialRevisionStandardPricing({ costPerUnit: 0.167, minutesPerUnit: 1 }),
//   }),
//   fixedPrice: new FixedPrice({ fixedPrice: 0 }),
// })
