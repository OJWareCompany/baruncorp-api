import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePtoTenurePolicyProps, PtoTenurePolicyProps } from './pto-tenure-policy.type'

export class PtoTenurePolicyEntity extends AggregateRoot<PtoTenurePolicyProps> {
  protected _id: string

  static create(create: CreatePtoTenurePolicyProps) {
    const id = v4()
    const props: PtoTenurePolicyProps = {
      ...create,
    }

    return new PtoTenurePolicyEntity({ id, props })
  }

  get tenure(): number {
    return this.props.total
  }

  set tenure(tenure: number) {
    this.props.tenure = tenure
  }

  get total(): number {
    return this.props.total
  }

  set total(total: number) {
    this.props.total = total
  }

  public validate(): void {
    return
  }
}
