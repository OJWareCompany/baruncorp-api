import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeletePtoCommand {
  readonly ptoId: string
  constructor(props: DeletePtoCommand) {
    initialize(this, props)
  }
}
