import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreatePaymentProps, PaymentProps } from './payment.type'
import { PaymentCreatedDomainEvent } from './events/payment-created.domain-event'

export class PaymentEntity extends AggregateRoot<PaymentProps> {
  protected _id: string

  static create(create: CreatePaymentProps) {
    const id = v4()
    const props: PaymentProps = {
      ...create,
      paymentDate: new Date(),
      canceledAt: null,
    }
    const payment = new PaymentEntity({ id, props })

    payment.addEvent(
      new PaymentCreatedDomainEvent({
        aggregateId: payment.id,
        invoiceId: create.invoiceId,
      }),
    )
    return payment
  }

  cancel(): this {
    this.props.canceledAt = new Date()
    return this
  }

  public validate(): void {
    return
  }
}
