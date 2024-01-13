import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreatePtoDetailCommand {
  readonly userId: string
  readonly ptoTypeId: string
  readonly amount: number
  readonly startedAt: Date
  readonly days: number
  constructor(props: CreatePtoDetailCommand) {
    initialize(this, props)
  }
}
