import { initialize } from '../../../../libs/utils/constructor-initializer'

export class IssueInvoiceCommand {
  readonly invoiceId: string
  readonly cc?: string[]
  readonly issuedByUserName: string
  readonly issuedByUserId: string
  readonly files: Express.Multer.File[] | null

  constructor(props: IssueInvoiceCommand) {
    initialize(this, props)
  }
}
