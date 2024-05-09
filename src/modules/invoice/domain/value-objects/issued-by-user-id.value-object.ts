import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface IssuedByUserIdProps {
  value: string
}

export class IssuedByUserId extends ValueObject<IssuedByUserIdProps> {
  get value(): string {
    return this.props.value
  }

  protected validate(props: IssuedByUserIdProps): void {
    return
  }
}
