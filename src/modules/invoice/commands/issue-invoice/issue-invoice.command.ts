import { Attachment } from 'nodemailer/lib/mailer'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class IssueInvoiceCommand {
  readonly invoiceId: string
  readonly files: Express.Multer.File[] | null

  constructor(props: IssueInvoiceCommand) {
    initialize(this, props)
  }
}
