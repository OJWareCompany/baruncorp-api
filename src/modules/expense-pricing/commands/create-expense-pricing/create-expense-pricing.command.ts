import { initialize } from '../../../../libs/utils/constructor-initializer'

export enum ExpenseTypeEnum {
  fixed = 'Fixed',
  percentage = 'Percentage',
}

export class CreateExpensePricingCommand {
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
  constructor(props: CreateExpensePricingCommand) {
    initialize(this, props)
  }
}
