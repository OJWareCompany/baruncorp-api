import { initialize } from '../../../../libs/utils/constructor-initializer'
import { VendorCreditTransactionTypeEnum } from '../../domain/vendor-credit-transaction.type'

export class CreateVendorCreditTransactionCommand {
  readonly createdByUserId: string
  readonly amount: number
  readonly creditTransactionType: VendorCreditTransactionTypeEnum
  readonly relatedVendorInvoiceId?: string | null
  readonly vendorOrganizationId: string
  readonly note: string | null
  constructor(props: CreateVendorCreditTransactionCommand) {
    initialize(this, props)
  }
}
