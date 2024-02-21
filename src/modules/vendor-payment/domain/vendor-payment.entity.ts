import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateVendorPaymentProps, VendorPaymentProps } from './vendor-payment.type'
import { VendorPaymentCreatedDomainEvent } from './events/vendor-payment-created.domain-event'
import { VendorPaymentCanceledDomainEvent } from './events/vendor-payment-canceled.domain-event'

export class VendorPaymentEntity extends AggregateRoot<VendorPaymentProps> {
  protected _id: string

  static create(create: CreateVendorPaymentProps) {
    const id = v4()
    const props: VendorPaymentProps = {
      ...create,
      paymentDate: new Date(),
      canceledAt: null,
    }
    const payment = new VendorPaymentEntity({ id, props })

    payment.addEvent(
      new VendorPaymentCreatedDomainEvent({
        aggregateId: payment.id,
        vendorInvoiceId: create.vendorInvoiceId,
      }),
    )
    return payment
  }

  get amount(): number {
    return this.props.amount
  }

  get isValid(): boolean {
    return this.props.canceledAt === null
  }

  cancel(): this {
    this.props.canceledAt = new Date()
    this.addEvent(
      new VendorPaymentCanceledDomainEvent({
        aggregateId: this.id,
        vendorInvoiceId: this.props.vendorInvoiceId,
      }),
    )
    return this
  }

  public validate(): void {
    return
  }
}
