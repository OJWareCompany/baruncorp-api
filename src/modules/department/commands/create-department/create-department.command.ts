import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateDepartmentCommand {
  readonly name: string
  readonly description: string | null
  constructor(props: CreateDepartmentCommand) {
    initialize(this, props)
  }
}
