import { ValueObject } from '../../../../libs/ddd/value-object.base'

export enum UserRoleNameEnum {
  special_admin = 'Special Admin',
  admin = 'Admin',
  member = 'Member',
  client_company_manager = 'Client Company Manager',
  client_company_employee = 'Client Company Employee',
  viewer = 'Viewer',
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
