import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface PhoneProps {
  number: string
}

export class Phone extends ValueObject<PhoneProps> {
  get number(): string {
    return this.props.number
  }

  protected validate(props: PhoneProps): void {
    return
  }
}
