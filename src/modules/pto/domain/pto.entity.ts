import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string
  details: any

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
      details: [],
    }

    return new PtoEntity({ id, props })
  }

  public getUsedPtoValue(): number {
    let totalValue = 0
    this.props.details.forEach((detail) => {
      totalValue += detail.getProps().value
    })

    return totalValue
  }

  public getUsablePtoValue(): number {
    return this.props.total - this.getUsedPtoValue()
  }

  public validate(): void {
    return
  }
}
