import { UserName } from './value-objects/user-name.vo'

// id field should be in base entity
// TODO: Generate entity.base.ts

export interface UserProps {
  email: string
  userName: UserName
  organizationId: string
  address: string | null
  phoneNumber: string | null
  isActiveWorkResource: boolean | null
  isCurrentUser: boolean | null
  isInactiveOrganizationUser: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  updatedBy: string | null
  type: string | null
}

export interface CreateUserProps {
  email: string
  userName: UserName
  organizationId: string
  address: string | null
  phoneNumber: string | null
  isActiveWorkResource: boolean | null
  isCurrentUser: boolean | null
  isInactiveOrganizationUser: boolean | null
  isRevenueShare: boolean | null
  isRevisionRevenueShare: boolean | null
  type: string | null
}
