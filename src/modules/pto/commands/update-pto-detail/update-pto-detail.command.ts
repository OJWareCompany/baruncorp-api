import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoDetailCommand {
  readonly ptoDetailId: string
  readonly startedAt?: Date
  readonly days?: number
  readonly ptoTypeId?: string
  readonly amountPerDay?: number
  constructor(props: UpdatePtoDetailCommand) {
    initialize(this, props)
  }
}
