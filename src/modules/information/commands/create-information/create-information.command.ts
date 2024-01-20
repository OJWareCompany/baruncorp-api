import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateInformationCommand {
  readonly contents: JSON[]
  constructor(props: CreateInformationCommand) {
    initialize(this, props)
  }
}
