import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoRangeCommand {
  readonly userId: string
  readonly dateOfJoining: Date | null
  constructor(props: UpdatePtoRangeCommand) {
    initialize(this, props)
  }
}
