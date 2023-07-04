import { UserName } from '../../users/vo/user-name.vo'
import { StateEntity } from '../entities/state.entity'

export type LicenseType = 'Electrical' | 'Structural'

// TODO: issuingCountryName로 명시하고싶은데
export interface LicenseProps {
  userId: string
  userName: UserName
  type: LicenseType
  stateEntity: StateEntity
  priority: number
  issuedDate: Date
  expiryDate: Date
}

export interface CreateLicenseProps {
  userId: string
  userName: UserName
  type: LicenseType
  stateEntity: StateEntity
  priority: number
  issuedDate: Date
  expiryDate: Date
}

export interface DeleteLicenseProps {
  userId: string
  type: LicenseType
  stateEntity: StateEntity
}
