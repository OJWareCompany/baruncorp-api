import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface FixedPriceProps {
  value: number
}

export class FixedPrice extends ValueObject<FixedPriceProps> {
  get value(): number {
    return this.props.value
  }

  protected validate(props: FixedPriceProps): void {
    return
  }
}
