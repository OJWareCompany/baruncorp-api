import { UserName } from './domain/value-objects/user-name.vo'
import { State } from './domain/value-objects/state.vo'

// export type LicenseType =
export enum LicenseTypeEnum {
  Electrical = 'Electrical',
  Structural = 'Structural',
}

// TODO: issuingCountryName로 명시하고싶은데
export interface LicenseProps {
  userId: string
  userName: UserName
  type: LicenseTypeEnum
  stateEntity: State
  priority: number | null
  // issuedDate: Date
  expiryDate: Date | null
}

export interface CreateLicenseProps {
  userId: string
  userName: UserName
  type: LicenseTypeEnum
  stateEntity: State
  priority: number | null
  // issuedDate: Date
  expiryDate: Date | null
}

export interface DeleteLicenseProps {
  userId: string
  type: LicenseTypeEnum
  stateEntity: State
}
