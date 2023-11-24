import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface CommercialStandardPricingTierProps {
  startingPoint: number
  finishingPoint: number
  price: number
}

export class CommercialStandardPricingTier extends ValueObject<CommercialStandardPricingTierProps> {
  get startingPoint(): number {
    return this.props.startingPoint
  }

  get finishingPoint(): number {
    return this.props.finishingPoint
  }

  get price(): number {
    return this.props.price
  }

  protected validate(props: CommercialStandardPricingTierProps): void {
    return
  }
}

new CommercialStandardPricingTier({ finishingPoint: 1, startingPoint: 2, price: 2 })
