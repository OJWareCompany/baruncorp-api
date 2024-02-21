import { addDays } from 'date-fns'
import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateVendorInvoiceProps, VendorInvoiceProps } from './vendor-invoice.type'
import { VendorInvoiceCalculator } from './domain-services/vendor-invoice-calculator.domain-service'

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

  async enterVendorInvoicedTotal(total: number, calculator: VendorInvoiceCalculator): Promise<this> {
    const paidAmount = await calculator.calcPaymentTotal(this)
    this.props.total = total
    this.props.invoiceTotalDifference = this.props.subTotal - this.props.total // internal subtotal에서 실제 청구된 금액을 뺀다.
    this.props.internalTotalBalanceDue = this.props.total - paidAmount // find how much paid, 지불 해야할 남은 금액
    return this
  }
}
