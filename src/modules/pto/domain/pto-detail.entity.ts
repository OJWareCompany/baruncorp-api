import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoDetailProps, PtoDetailProps } from './pto-detail.type'

export class PtoDetailEntity extends AggregateRoot<PtoDetailProps> {
  protected _id: string

  static create(create: CreatePtoDetailProps) {
    const id = v4()
    const props: PtoDetailProps = {
      ...create,
      isPaid: false, //from Pto
      name: '', //from PtoType
      abbreviation: '', //from PtoType
    }

    return new PtoDetailEntity({ id, props })
  }

  set startedAt(startedAt: Date) {
    this.props.startedAt = startedAt
  }

  set days(days: number) {
    this.props.days = days
  }

  set ptoTypeId(ptoTypeId: string) {
    this.props.ptoTypeId = ptoTypeId
  }

  set amount(amount: number) {
    this.props.amount = amount
  }

  public validate(): void {
    return
  }
}
