import { UserName } from './value-objects/user-name.vo'

// id field should be in base entity
// TODO: Generate entity.base.ts

export interface UserProps {
  email: string
  userName: UserName
  organizationId: string
  address: string | null
  phoneNumber: string | null
  updatedBy: string
  type: string
  deliverablesEmails: string[]
}

export interface CreateUserProps {
  email: string
  userName: UserName
  organizationId: string
  address: string | null
  phoneNumber: string | null
  updatedBy: string
  type: string
  deliverablesEmails: string[]
}
