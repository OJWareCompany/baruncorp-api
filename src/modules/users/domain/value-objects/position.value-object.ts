import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { Guard } from '../../../../libs/guard'

export interface PositionProps {
  id: string
  name: string
}

export class Position extends ValueObject<PositionProps> {
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  protected validate(props: PositionProps): void {
    if (Guard.isEmpty(props)) console.log('position name X')
  }
}
