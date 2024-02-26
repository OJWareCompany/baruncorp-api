import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  CreateVendorCreditTransactionProps,
  VendorCreditTransactionProps,
  VendorCreditTransactionTypeEnum,
} from './vendor-credit-transaction.type'
import { VendorCreditTransactionCreatedDomainEvent } from './domain-events/vendor-credit-transaction-created.domain-event'
import { VendorCreditTransactionCanceledDomainEvent } from './domain-events/vendor-credit-transaction-canceled.domain-event'

export class VendorCreditTransactionEntity extends AggregateRoot<VendorCreditTransactionProps> {
  protected _id: string

  static create(create: CreateVendorCreditTransactionProps) {
    const id = v4()
    const props: VendorCreditTransactionProps = { ...create, transactionDate: new Date(), canceledAt: null }
    const entity = new VendorCreditTransactionEntity({ id, props })

    entity.addEvent(
      new VendorCreditTransactionCreatedDomainEvent({
        aggregateId: entity.id,
        invoiceId: entity.getProps().relatedVendorInvoiceId,
      }),
    )

    return entity
  }

  get amount(): number {
    return this.props.creditTransactionType === VendorCreditTransactionTypeEnum.Reload
      ? this.props.amount
      : -this.props.amount
  }

  get isValid(): boolean {
    return this.props.canceledAt === null
  }

  isMatched(vendorInvoiceId: string): boolean {
    return this.props.relatedVendorInvoiceId === vendorInvoiceId
  }

  cancel(): this {
    this.props.canceledAt = new Date()
    this.addEvent(
      new VendorCreditTransactionCanceledDomainEvent({
        aggregateId: this.id,
        vendorInvoiceId: this.props.relatedVendorInvoiceId,
      }),
    )
    return this
  }

  public validate(): void {
    return
  }
}
