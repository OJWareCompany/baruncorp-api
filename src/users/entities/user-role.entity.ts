import { CreateUserRoleProps, UserRoleProps } from '../interfaces/user-role.interface'

export class UserRoleEntity {
  protected readonly props: UserRoleProps

  constructor(props: CreateUserRoleProps) {
    this.props = props
  }

  getProps() {
    const copy = { ...this.props }
    return Object.freeze(copy)
  }
}
