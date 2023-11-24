import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface CommercialRevisionStandardPricingProps {
  costPerUnit: number | null
  minutesPerUnit: number | null
}

export class CommercialRevisionStandardPricing extends ValueObject<CommercialRevisionStandardPricingProps> {
  get costPerUnit(): number | null {
    return this.props.costPerUnit
  }

  get minutesPerUnit(): number | null {
    return this.props.minutesPerUnit
  }

  protected validate(props: CommercialRevisionStandardPricingProps): void {
    return
  }
}
