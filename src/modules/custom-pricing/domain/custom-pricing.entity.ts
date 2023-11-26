import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateCustomPricingProps, CustomPricingProps } from './custom-pricing.type'

export class CustomPricingEntity extends AggregateRoot<CustomPricingProps> {
  protected _id: string

  static create(create: CreateCustomPricingProps) {
    const id = v4()
    const props: CustomPricingProps = {
      ...create,
    }
    return new CustomPricingEntity({ id, props })
  }

  public validate(): void {
    if (this.props.fixedPricing) {
      this.props.commercialNewServiceTiers = []
      this.props.residentialNewServiceTiers = []
      this.props.residentialRevisionPricing = null
    }
    return
  }
}
