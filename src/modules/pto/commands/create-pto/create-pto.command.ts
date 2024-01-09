import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreatePtoCommand {
  readonly userId: string
  readonly tenure: number
  readonly total: number
  constructor(props: CreatePtoCommand) {
    initialize(this, props)
  }
}
