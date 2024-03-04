import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteDepartmentCommand {
  readonly departmentId: string
  constructor(props: DeleteDepartmentCommand) {
    initialize(this, props)
  }
}
