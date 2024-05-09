import { ValueObject } from '../../../../libs/ddd/value-object.base'

interface IssuedByUserNameProps {
  value: string
}

export class IssuedByUserName extends ValueObject<IssuedByUserNameProps> {
  get value(): string {
    return this.props.value
  }

  protected validate(props: IssuedByUserNameProps): void {
    return
  }
}
