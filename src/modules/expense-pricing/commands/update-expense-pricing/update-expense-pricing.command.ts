import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ExpenseTypeEnum } from '../create-expense-pricing/create-expense-pricing.command'

export class UpdateExpensePricingCommand {
  readonly taskId: string
  readonly organizationId: string
  readonly resiNewExpenseType: ExpenseTypeEnum
  readonly resiNewValue: number
  readonly resiRevExpenseType: ExpenseTypeEnum
  readonly resiRevValue: number
  readonly comNewExpenseType: ExpenseTypeEnum
  readonly comNewValue: number
  readonly comRevExpenseType: ExpenseTypeEnum
  readonly comRevValue: number
  constructor(props: UpdateExpensePricingCommand) {
    initialize(this, props)
  }
}
