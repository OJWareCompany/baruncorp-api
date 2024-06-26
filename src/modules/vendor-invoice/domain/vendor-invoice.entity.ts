import { add, addDays } from 'date-fns'
import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateVendorInvoiceProps, VendorInvoiceProps, VendorInvoiceTermsEnum } from './vendor-invoice.type'
import { VendorInvoiceCalculator } from './domain-services/vendor-invoice-calculator.domain-service'
import { VendorInvoiceInvalidTotalUpdateException } from './vendor-invoice.error'

export class VendorInvoiceEntity extends AggregateRoot<VendorInvoiceProps> {
  protected _id: string

  static create(create: CreateVendorInvoiceProps) {
    const id = v4()
    const props: VendorInvoiceProps = {
      ...create,
      dueDate: addDays(create.invoiceDate, create.terms),
      transactionType: null,
    }
    return new VendorInvoiceEntity({ id, props })
  }

  public validate(): void {
    return
  }

  get total(): number {
    return this.props.total
  }

  get vendorOrganizationId(): string {
    return this.props.organizationId
  }

  async setSubtotal(subtotal: number, calculator: VendorInvoiceCalculator) {
    if (this.props.subTotal === this.props.total) {
      // total을 직접 수정 하지 않았을때는 subtotal과 함께 수정되도록한다.
      this.props.total = subtotal
    }

    const paidAmount = await calculator.calcPaymentTotal(this)
    this.props.subTotal = subtotal
    this.props.invoiceTotalDifference = this.props.subTotal - this.props.total // internal subtotal에서 실제 청구된 금액을 뺀다.
    this.props.internalTotalBalanceDue = this.props.total - paidAmount // find how much paid, 지불 해야할 남은 금액
    return this
  }

  async enterVendorInvoicedTotal(total: number, calculator: VendorInvoiceCalculator): Promise<this> {
    const paidAmount = await calculator.calcPaymentTotal(this)
    if (total < paidAmount) throw new VendorInvoiceInvalidTotalUpdateException()
    this.props.total = total
    this.props.invoiceTotalDifference = this.props.subTotal - this.props.total // internal subtotal에서 실제 청구된 금액을 뺀다.
    this.props.internalTotalBalanceDue = this.props.total - paidAmount // find how much paid, 지불 해야할 남은 금액
    return this
  }

  setInvoiceDate(invoiceDate: Date, term: VendorInvoiceTermsEnum) {
    this.props.invoiceDate = invoiceDate
    this.props.terms = term
    // this.setDueDate()
    return this
  }

  async determinePaymentTotalAndStatus(calculator: VendorInvoiceCalculator) {
    const paidAmount = await calculator.calcPaymentTotal(this)
    this.props.internalTotalBalanceDue = this.props.total - paidAmount // find how much paid, 지불 해야할 남은 금액
    return this
  }

  // Auto updated column in database
  private setDueDate() {
    this.props.dueDate = add(this.props.invoiceDate, {
      days:
        this.props.terms === VendorInvoiceTermsEnum.Days21
          ? 21
          : this.props.terms === VendorInvoiceTermsEnum.Days30
          ? 30
          : 60,
    })
    return this
  }

  setNote(note: string | null) {
    this.props.note = note
    return this
  }
}
