import { initialize } from '../../../../libs/utils/constructor-initializer'

export class IssueInvoiceCommand {
  readonly invoiceId: string
  readonly file: string | null
  constructor(props: IssueInvoiceCommand) {
    initialize(this, props)
  }
}
