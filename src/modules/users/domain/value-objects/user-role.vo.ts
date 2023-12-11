import { ValueObject } from '../../../../libs/ddd/value-object.base'

export enum UserRoleNameEnum {
  special_admin = 'special admin',
  admin = 'admin',
  member = 'member',
  client_company_manager = 'client company manager',
  client_company_employee = 'client company employee',
  guest = 'guest',
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
