import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateInformationCommand {
  readonly updatedBy: string
  readonly contents: string

  constructor(props: CreateInformationCommand) {
    initialize(this, props)
  }
}
