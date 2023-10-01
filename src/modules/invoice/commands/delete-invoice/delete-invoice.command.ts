import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteInvoiceCommand {
  readonly invoiceId: string
  constructor(props: DeleteInvoiceCommand) {
    initialize(this, props)
  }
}
