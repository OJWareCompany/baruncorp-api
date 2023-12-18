import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePositionProps, PositionProps } from './position.type'

export class PositionEntity extends AggregateRoot<PositionProps> {
  protected _id: string

  static create(create: CreatePositionProps) {
    const id = v4()
    const props: PositionProps = { ...create }
    return new PositionEntity({ id, props })
  }

  public validate(): void {
    return
  }
}
