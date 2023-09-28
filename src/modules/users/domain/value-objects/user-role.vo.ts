import { ValueObject } from '../../../../libs/ddd/value-object.base'

export enum UserRoleNameEnum {
  admin = 'admin',
  manager = 'manager',
  member = 'member',
  guest = 'guest',
  client = 'client',
}

export interface CreateUserRoleProps {
  userId: string
  roleName: UserRoleNameEnum
}

export type UserRoleProps = CreateUserRoleProps

export class UserRole extends ValueObject<UserRoleProps> {
  get userId(): string {
    return this.props.userId
  }

  get name(): UserRoleNameEnum {
    return this.props.roleName
  }

  protected validate(props: CreateUserRoleProps): void {
    return
  }
}
