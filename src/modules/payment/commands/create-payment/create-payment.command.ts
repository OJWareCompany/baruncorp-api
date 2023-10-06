import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaymentMethodEnum } from '../../domain/payment.type'

export class CreatePaymentCommand {
  readonly invoiceId: string
  readonly amount: number
  readonly paymentMethod: PaymentMethodEnum
  readonly notes: string | null
  readonly createdBy: string
  constructor(props: CreatePaymentCommand) {
    initialize(this, props)
  }
}
