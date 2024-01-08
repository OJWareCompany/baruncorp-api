import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoCommand {
  readonly ptoId: string
  readonly name: string
  constructor(props: UpdatePtoCommand) {
    initialize(this, props)
  }
}
