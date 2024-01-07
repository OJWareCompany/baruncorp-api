import { initialize } from '../../../../libs/utils/constructor-initializer'
import { UserRoleNameEnum } from '../../domain/value-objects/user-role.vo'

export class ChangeUserRoleCommand {
  readonly userId: string
  readonly newRole: UserRoleNameEnum
  readonly updatedByUserId: string
  constructor(props: ChangeUserRoleCommand) {
    initialize(this, props)
  }
}
