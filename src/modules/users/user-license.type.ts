import { UserName } from './domain/value-objects/user-name.vo'
import { State } from '../department/domain/value-objects/state.vo'

// export type LicenseType =
export enum LicenseType {
  Electrical = 'Electrical',
  Structural = 'Structural',
}

// TODO: issuingCountryName로 명시하고싶은데
export interface LicenseProps {
  userId: string
  userName: UserName
  type: LicenseType
  stateEntity: State
  priority: number | null
  // issuedDate: Date
  expiryDate: Date | null
}

export interface CreateLicenseProps {
  userId: string
  userName: UserName
  type: LicenseType
  stateEntity: State
  priority: number | null
  // issuedDate: Date
  expiryDate: Date | null
}

export interface DeleteLicenseProps {
  userId: string
  type: LicenseType
  stateEntity: State
}
