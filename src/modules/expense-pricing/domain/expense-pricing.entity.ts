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

  calcResidentialNewCost(price: number | null) {
    if (this.props.resiNewExpenseType === ExpenseTypeEnum.fixed) return this.props.resiNewValue
    return (this.props.resiNewValue / 100) * Number(price)
  }

  calcResidentialRevisionCost(price: number | null) {
    if (this.props.resiRevExpenseType === ExpenseTypeEnum.fixed) return this.props.resiRevValue
    return (this.props.resiRevValue / 100) * Number(price)
  }

  calcCommerciallNewCost(price: number | null) {
    if (this.props.comNewExpenseType === ExpenseTypeEnum.fixed) return this.props.comNewValue
    return (this.props.comNewValue / 100) * Number(price)
  }

  calcCommerciallRevisionCost(price: number | null) {
    if (this.props.comRevExpenseType === ExpenseTypeEnum.fixed) return this.props.comRevValue
    return (this.props.comRevValue / 100) * Number(price)
  }

  public validate(): void {
    return
  }
}
