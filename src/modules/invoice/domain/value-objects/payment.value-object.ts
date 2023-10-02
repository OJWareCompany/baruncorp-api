import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { PaymentMethodEnum } from '../../../payment/domain/payment.type'

interface PaymentVOProps {
  invoiceId: string
  amount: number
  paymentMethod: PaymentMethodEnum
  notes: string | null
  paymentDate: Date
  canceledAt: Date | null
}

export class PaymentVO extends ValueObject<PaymentVOProps> {
  get invoiceId(): string {
    return this.props.invoiceId
  }

  get amount(): number {
    return this.props.amount
  }

  get paymentMethod(): PaymentMethodEnum {
    return this.props.paymentMethod
  }

  get notes(): string | null {
    return this.props.notes
  }

  get paymentDate(): Date {
    return this.props.paymentDate
  }

  get canceledAt(): Date | null {
    return this.props.canceledAt
  }

  protected validate(props: PaymentVOProps): void {
    return
  }
}
