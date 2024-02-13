import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateUtilityCommand {
  readonly updatedBy: string
  readonly name: string
  readonly stateAbbreviations: string[]
  readonly notes?: string

  constructor(props: CreateUtilityCommand) {
    initialize(this, props)
  }
}
