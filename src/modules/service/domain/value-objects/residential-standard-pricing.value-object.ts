import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface ResidentialStandardPricingProps {
  price: number | null
  gmPrice: number | null
  revisionPrice: number | null
  revisionGmPrice: number | null
}

export class ResidentialStandardPricing extends ValueObject<ResidentialStandardPricingProps> {
  get price(): number | null {
    return this.props.price
  }

  get gmPrice(): number | null {
    return this.props.gmPrice
  }

  get revisionPrice(): number | null {
    return this.props.revisionPrice
  }

  get revisionGmPrice(): number | null {
    return this.props.revisionGmPrice
  }

  protected validate(props: ResidentialStandardPricingProps): void {
    return
  }
}
