import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreatePtoDetailCommand {
  readonly userId: string
  readonly ptoTypeId: string
  readonly value: number
  readonly startedAt: Date
  readonly endedAt: Date
  readonly days: number
  constructor(props: CreatePtoDetailCommand) {
    initialize(this, props)
  }
}
