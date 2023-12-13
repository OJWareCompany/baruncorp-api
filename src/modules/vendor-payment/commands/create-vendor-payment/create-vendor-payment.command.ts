import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaymentMethodEnum } from '../../domain/vendor-payment.type'

export class CreateVendorPaymentCommand {
  readonly vendorInvoiceId: string
  readonly amount: number
  readonly paymentMethod: PaymentMethodEnum
  readonly notes: string | null
  readonly createdBy: string
  constructor(props: CreateVendorPaymentCommand) {
    initialize(this, props)
  }
}
