import { initialize } from '../../../../libs/utils/constructor-initializer'

export class InviteCommand {
  readonly organizationId: string
  readonly email: string
  constructor(props: InviteCommand) {
    initialize(this, props)
  }
}
