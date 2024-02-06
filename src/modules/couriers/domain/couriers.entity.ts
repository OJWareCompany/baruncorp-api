import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateCouriersProps, CouriersProps } from './couriers.type'

export class CouriersEntity extends AggregateRoot<CouriersProps> {
  protected _id: string

  static create(create: CreateCouriersProps) {
    const id: string = v4()
    const props: CouriersProps = {
      ...create,
    }

    return new CouriersEntity({ id, props })
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get urlParam(): string {
    return this.props.urlParam
  }

  set urlParam(urlParam: string) {
    this.props.urlParam = urlParam
  }

  public validate(): void {
    return
  }
}
