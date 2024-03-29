import { initialize } from '../../../../libs/utils/constructor-initializer'

export class JoinOrganizationCommand {
  readonly joiningUserId: string
  readonly organizationId: string
  readonly dateOfJoining: Date | null
  readonly editorUserId: string
  constructor(props: JoinOrganizationCommand) {
    initialize(this, props)
  }
}
