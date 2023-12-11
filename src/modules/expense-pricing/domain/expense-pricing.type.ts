import { ExpenseTypeEnum } from '../commands/create-expense-pricing/create-expense-pricing.command'

export interface CreateExpensePricingProps {
  taskId: string
  organizationId: string
  taskName: string
  resiNewExpenseType: ExpenseTypeEnum
  resiNewValue: number
  resiRevExpenseType: ExpenseTypeEnum
  resiRevValue: number
  comNewExpenseType: ExpenseTypeEnum
  comNewValue: number
  comRevExpenseType: ExpenseTypeEnum
  comRevValue: number
}
export type ExpensePricingProps = CreateExpensePricingProps
