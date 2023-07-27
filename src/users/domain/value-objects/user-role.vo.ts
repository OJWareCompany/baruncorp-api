export enum UserRoles {
  admin = 'admin',
  manager = 'manager',
  member = 'member',
  guest = 'guest',
}

export interface UserRoleProps {
  userId: string
  role: UserRoles
}

export interface CreateUserRoleProps {
  userId: string
  role: UserRoles
}

export class UserRole {
  protected readonly props: UserRoleProps

  constructor(props: CreateUserRoleProps) {
    this.props = props
  }

  getProps() {
    const copy = { ...this.props }
    return Object.freeze(copy)
  }
}
