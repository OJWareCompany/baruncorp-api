import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoPayCommand {
  readonly ptoId: string
  readonly isPaid: boolean
  constructor(props: UpdatePtoPayCommand) {
    initialize(this, props)
  }
}
