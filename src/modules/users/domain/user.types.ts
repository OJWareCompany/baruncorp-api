import { UserName } from './value-objects/user-name.vo'

// id field should be in base entity
// TODO: Generate entity.base.ts

export interface UserProps {
  email: string
  userName: UserName
  organizationId: string
}

export interface CreateUserProps {
  email: string
  userName: UserName
  organizationId: string
}
