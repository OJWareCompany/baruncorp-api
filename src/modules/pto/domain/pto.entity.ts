import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoProps, PtoProps } from './pto.type'

export class PtoEntity extends AggregateRoot<PtoProps> {
  protected _id: string

  static create(create: CreatePtoProps) {
    const id = v4()
    const props: PtoProps = {
      ...create,
      details: [],
    }

    return new PtoEntity({ id, props })
  }

  get total(): number {
    return this.props.total
  }

  set total(total: number) {
    this.props.total = total
  }

  get isPaid(): boolean {
    return this.props.isPaid
  }

  set isPaid(isPaid: boolean) {
    this.props.isPaid = isPaid
  }

  public validate(): void {
    return
  }
}
