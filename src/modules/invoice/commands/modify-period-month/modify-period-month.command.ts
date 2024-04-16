import { initialize } from '../../../../libs/utils/constructor-initializer'
import { InvoiceTermsEnum } from '../../domain/invoice.type'

export class ModifyPeriodMonthCommand {
  readonly invoiceId: string
  readonly serviceMonth: Date
  constructor(props: ModifyPeriodMonthCommand) {
    initialize(this, props)
  }
}
