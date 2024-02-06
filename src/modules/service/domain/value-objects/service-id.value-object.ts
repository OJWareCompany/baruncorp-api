import { ValueObject } from '../../../../libs/ddd/value-object.base'

export interface ServiceIdProps {
  value: string
}

export class ServiceId extends ValueObject<ServiceIdProps> {
  get value(): string {
    return this.props.value
  }

  protected validate(props: ServiceIdProps): void {
    return
  }
}
