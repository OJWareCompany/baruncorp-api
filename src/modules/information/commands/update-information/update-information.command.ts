import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateInformationCommand {
  readonly informationId: string
  readonly contents: string
  readonly updatedBy: string
  constructor(props: UpdateInformationCommand) {
    initialize(this, props)
  }
}
