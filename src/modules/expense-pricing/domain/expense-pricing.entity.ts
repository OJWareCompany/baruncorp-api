import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateExpensePricingProps, ExpensePricingProps } from './expense-pricing.type'
import { ExpenseTypeEnum } from '../commands/create-expense-pricing/create-expense-pricing.command'

export class ExpensePricingEntity extends AggregateRoot<ExpensePricingProps> {
  protected _id: string

  static create(create: CreateExpensePricingProps) {
    const id = v4()
    const props: ExpensePricingProps = { ...create }
    return new ExpensePricingEntity({ id, props })
  }

  putUpdate(
    resiNewExpenseType: ExpenseTypeEnum,
    resiNewValue: number,
    resiRevExpenseType: ExpenseTypeEnum,
    resiRevValue: number,
    comNewExpenseType: ExpenseTypeEnum,
    comNewValue: number,
    comRevExpenseType: ExpenseTypeEnum,
    comRevValue: number,
  ) {
    this.props.resiNewExpenseType = resiNewExpenseType
    this.props.resiNewValue = resiNewValue
    this.props.resiRevExpenseType = resiRevExpenseType
    this.props.resiRevValue = resiRevValue
    this.props.comNewExpenseType = comNewExpenseType
    this.props.comNewValue = comNewValue
    this.props.comRevExpenseType = comRevExpenseType
    this.props.comRevValue = comRevValue
    return this
  }

  public validate(): void {
    return
  }
}
