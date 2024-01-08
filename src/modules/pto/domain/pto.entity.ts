import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
      availableValues: [],
    }
    return new PtoEntity({ id, props })
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get availableValues() {
    return this.props.availableValues
  }

  public validate(): void {
    return
  }
}
