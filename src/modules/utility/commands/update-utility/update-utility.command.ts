import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateUtilityCommand {
  readonly utilityId: string
  readonly updatedBy: string
  readonly name?: string
  readonly stateAbbreviations?: string[]
  readonly notes?: string
  constructor(props: UpdateUtilityCommand) {
    initialize(this, props)
  }
}
