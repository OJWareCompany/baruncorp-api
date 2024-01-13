import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoTotalCommand {
  readonly ptoId: string
  readonly total: number
  constructor(props: UpdatePtoTotalCommand) {
    initialize(this, props)
  }
}
