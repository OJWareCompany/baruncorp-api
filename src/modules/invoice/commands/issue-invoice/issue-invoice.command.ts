import { initialize } from '../../../../libs/utils/constructor-initializer'

export class IssueInvoiceCommand {
  readonly invoiceId: string
  readonly files: []
  constructor(props: IssueInvoiceCommand) {
    initialize(this, props)
  }
}
