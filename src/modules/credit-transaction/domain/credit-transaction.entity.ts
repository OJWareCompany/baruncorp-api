import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import {
  CreateCreditTransactionProps,
  CreditTransactionProps,
  CreditTransactionTypeEnum,
} from './credit-transaction.type'
import { CreditTransactionCreatedDomainEvent } from './domain-events/credit-transaction-created.domain-event'

export class CreditTransactionEntity extends AggregateRoot<CreditTransactionProps> {
  protected _id: string

  static create(create: CreateCreditTransactionProps) {
    const id = v4()
    const props: CreditTransactionProps = { ...create, transactionDate: new Date(), canceledAt: null }
    const entity = new CreditTransactionEntity({ id, props })

    entity.addEvent(
      new CreditTransactionCreatedDomainEvent({
        aggregateId: entity.id,
      }),
    )

    return entity
  }

  get amount(): number {
    return this.props.creditTransactionType === CreditTransactionTypeEnum.Reload
      ? this.props.amount
      : -this.props.amount
  }

  get isValid(): boolean {
    return this.props.canceledAt === null
  }

  isMatched(invoiceId: string): boolean {
    return this.props.relatedInvoiceId === invoiceId
  }

  cancel(): this {
    this.props.canceledAt = new Date()
    return this
  }

  public validate(): void {
    return
  }
}
