import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateDepartmentCommand {
  readonly departmentId: string
  readonly name: string
  readonly description: string | null
  constructor(props: UpdateDepartmentCommand) {
    initialize(this, props)
  }
}
