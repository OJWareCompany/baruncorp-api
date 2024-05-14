import { ValueObject } from '../../../../libs/ddd/value-object.base'

const { APP_MODE } = process.env

interface InvoiceRecipientEmailProps {
  value: string
}

export class InvoiceRecipientEmail extends ValueObject<InvoiceRecipientEmailProps> {
  get value(): string {
    return APP_MODE === 'production' ? this.props.value : this.getDevInvoiceRecipientEmail()
  }

  private getDevInvoiceRecipientEmail(): string {
    const isDevEmail = !!this.props.value?.endsWith('oj.vision')
    if (!!isDevEmail && this.props.value) return this.props.value
    return 'hyomin@oj.vision'
  }

  protected validate(props: InvoiceRecipientEmailProps): void {
    return
  }
}
