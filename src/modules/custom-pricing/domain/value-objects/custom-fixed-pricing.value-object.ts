import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface CustomFixedPriceProps {
  value: number
}

export class CustomFixedPrice extends ValueObject<CustomFixedPriceProps> {
  get value(): number {
    return this.props.value
  }

  protected validate(props: CustomFixedPriceProps): void {
    return
  }
}
