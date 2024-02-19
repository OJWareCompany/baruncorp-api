import { initialize } from '../../../../libs/utils/constructor-initializer'
import { CreditTransactionTypeEnum } from '../../domain/credit-transaction.type'

export class CreateCreditTransactionCommand {
  readonly createdByUserId: string
  readonly amount: number
  readonly creditTransactionType: CreditTransactionTypeEnum
  readonly relatedInvoiceId?: string | null
  readonly clientOrganizationId: string
  readonly note: string | null
  constructor(props: CreateCreditTransactionCommand) {
    initialize(this, props)
  }
}
