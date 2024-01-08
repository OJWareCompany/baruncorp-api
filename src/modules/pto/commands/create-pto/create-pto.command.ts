import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreatePtoCommand {
  readonly name: string
  constructor(props: CreatePtoCommand) {
    initialize(this, props)
  }
}
