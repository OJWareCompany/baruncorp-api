import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateInvoiceProps, InvoiceProps, InvoiceStatusEnum, InvoiceTermsEnum } from './invoice.type'
import addDays from 'date-fns/addDays'

export class InvoiceEntity extends AggregateRoot<InvoiceProps> {
  protected _id: string

  static create(create: CreateInvoiceProps) {
    const id = v4()
    const props: InvoiceProps = {
      ...create,
      dueDate: addDays(create.invoiceDate, create.terms),
      status: InvoiceStatusEnum.Unissued,
      payments: [],
    }
    return new InvoiceEntity({ id, props })
  }

  get status() {
    return this.props.status
  }

  updateCost(subTotal: number, discount: number) {
    this.props.subTotal = subTotal
    this.props.discount = discount
    this.props.total = subTotal - discount
    return this
  }

  issue(): this {
    this.props.status = InvoiceStatusEnum.Issued
    return this
  }

  setInvoiceDate(invoiceDate: Date) {
    this.props.invoiceDate = invoiceDate
    this.props.dueDate = addDays(invoiceDate, this.props.terms)
    return this
  }

  setTerms(terms: InvoiceTermsEnum): this {
    this.props.terms = terms
    this.props.dueDate = addDays(this.props.invoiceDate, terms)
    return this
  }

  setNote(notesToClient: string | null): this {
    this.props.notesToClient = notesToClient
    return this
  }

  public validate(): void {
    return
  }
}
