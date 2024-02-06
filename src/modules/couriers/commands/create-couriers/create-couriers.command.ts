import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateCouriersCommand {
  readonly name: string
  readonly urlParam: string
  constructor(props: CreateCouriersCommand) {
    initialize(this, props)
  }
}
