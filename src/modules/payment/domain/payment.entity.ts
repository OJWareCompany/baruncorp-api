import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePaymentProps, PaymentProps } from './payment.type'

export class PaymentEntity extends AggregateRoot<PaymentProps> {
  protected _id: string

  static create(create: CreatePaymentProps) {
    const id = v4()
    const props: PaymentProps = {
      ...create,
      paymentDate: new Date(),
      canceledAt: null,
    }
    return new PaymentEntity({ id, props })
  }

  cancel(): this {
    this.props.canceledAt = new Date()
    return this
  }

  public validate(): void {
    return
  }
}
