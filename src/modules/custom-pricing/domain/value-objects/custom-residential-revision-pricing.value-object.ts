import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface CustomResidentialRevisionPricingProps {
  price: number
  gmPrice: number
}

export class CustomResidentialRevisionPricing extends ValueObject<CustomResidentialRevisionPricingProps> {
  get price(): number {
    return this.props.price
  }

  get gmPrice(): number {
    return this.props.gmPrice
  }

  protected validate(props: CustomResidentialRevisionPricingProps): void {
    return
  }
}
