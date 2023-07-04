import { IsNumber, IsString } from 'class-validator'
import { LicenseType } from '../interfaces/license.interface'

export class CreateLicenseRequestDto {
  @IsString()
  userId: string
  @IsString()
  type: LicenseType
  @IsString()
  issuingCountryName: string
  @IsString()
  abbreviation: string
  @IsNumber()
  priority: number
  @IsString()
  issuedDate: Date
  @IsString()
  expiryDate: Date
}
