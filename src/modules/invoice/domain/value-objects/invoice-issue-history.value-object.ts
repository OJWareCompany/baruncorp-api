import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { EmailVO } from '../../../users/domain/value-objects/email.vo'
import { InvoiceRecipientEmail } from './invoice-recipient-email.value-object'
import { IssuedByUserId } from './issued-by-user-id.value-object'
import { IssuedByUserName } from './issued-by-user-name.value-object'

interface InvoiceIssueHistoryProps {
  invoiceId: string
  to: InvoiceRecipientEmail
  cc: EmailVO[]
  issuedAt: Date
  issuedByUserId: IssuedByUserId
  issuedByUserName: IssuedByUserName
}

export class InvoiceIssueHistory extends ValueObject<InvoiceIssueHistoryProps> {
  get invoiceId(): string {
    return this.props.invoiceId
  }

  get to(): InvoiceRecipientEmail {
    return this.props.to
  }

  get cc(): EmailVO[] {
    return this.props.cc
  }

  get issuedAt(): Date {
    return this.props.issuedAt
  }

  get issuedByUserId(): IssuedByUserId {
    return this.props.issuedByUserId
  }

  get issuedByUserName(): IssuedByUserName {
    return this.props.issuedByUserName
  }

  protected validate(props: InvoiceIssueHistoryProps): void {
    return
  }
}
