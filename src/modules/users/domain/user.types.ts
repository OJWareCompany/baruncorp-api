import { License } from './value-objects/license.value-object'
import { Organization } from './value-objects/organization.value-object'
import { Phone } from './value-objects/phone-number.value-object'
import { Position } from './value-objects/position.value-object'
import { Service } from './value-objects/service.value-object'
import { UserName } from './value-objects/user-name.vo'
import { UserRoleNameEnum } from './value-objects/user-role.vo'

// id field should be in base entity
// TODO: Generate entity.base.ts

export interface CreateUserProps {
  email: string
  userName: UserName
  organization: Organization
  phone: Phone | null
  updatedBy: string
  isVendor: boolean
  deliverablesEmails: string[]
}

export interface UserProps extends CreateUserProps {
  position: Position | null
  licenses: License[]
  services: Service[]
  role: UserRoleNameEnum
  type: string
}
