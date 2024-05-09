import { ValueObject } from '../../../../libs/ddd/value-object.base'

const { APP_MODE } = process.env

interface InvoiceRecipientEmailProps {
  value: string
}

export class InvoiceRecipientEmail extends ValueObject<InvoiceRecipientEmailProps> {
  get value(): string {
    return APP_MODE === 'production' ? this.props.value : 'hyomin@oj.vision'
  }

  protected validate(props: InvoiceRecipientEmailProps): void {
    return
  }
}
