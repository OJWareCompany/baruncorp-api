import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdatePtoTenurePolicyCommand {
  readonly ptoTenurePolicyId: string
  readonly total?: number
  constructor(props: UpdatePtoTenurePolicyCommand) {
    initialize(this, props)
  }
}
