import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateDepartmentCommand {
  readonly name: string
  readonly description: string | null
  readonly viewClientInvoice: boolean
  readonly viewVendorInvoice: boolean
  readonly viewCustomPricing: boolean
  readonly viewExpensePricing: boolean
  readonly viewScopePrice: boolean
  readonly viewTaskCost: boolean
  readonly editUserTask: boolean
  readonly editUserLicense: boolean
  readonly editUserPosition: boolean
  readonly sendDeliverables: boolean

  constructor(props: CreateDepartmentCommand) {
    initialize(this, props)
  }
}
