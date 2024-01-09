import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoCommand {
  readonly ptoId: string
  readonly total?: number
  readonly isPaid?: boolean
  constructor(props: UpdatePtoCommand) {
    initialize(this, props)
  }
}
