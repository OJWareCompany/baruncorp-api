import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeletePtoDetailCommand {
  readonly ptoDetailId: string
  constructor(props: DeletePtoDetailCommand) {
    initialize(this, props)
  }
}
