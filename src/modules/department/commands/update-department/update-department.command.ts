import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateDepartmentCommand {
  readonly departmentId: string
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
  readonly editMemberRole: boolean
  readonly editClientRole: boolean

  constructor(props: UpdateDepartmentCommand) {
    initialize(this, props)
  }
}
