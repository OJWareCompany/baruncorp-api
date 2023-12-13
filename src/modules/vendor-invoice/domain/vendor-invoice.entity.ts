import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateVendorInvoiceProps, VendorInvoiceProps } from './vendor-invoice.type'
import { addDays } from 'date-fns'

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
}
