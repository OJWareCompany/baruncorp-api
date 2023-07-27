import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LicenseType } from '../../user-license.entity'

export class CreateLicenseRequestDto {
  @IsString()
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  userId: string

  @IsString()
  @ApiProperty({ default: 'Electrical' })
  type: LicenseType

  @IsString()
  @ApiProperty({ default: 'FLORIDA' })
  issuingCountryName: string

  @IsString()
  @ApiProperty({ default: 'FL' })
  abbreviation: string

  @IsNumber()
  @ApiProperty({ default: 9 })
  priority: number

  @IsString()
  @ApiProperty({ default: new Date().toISOString() })
  issuedDate: Date

  @IsString()
  @ApiProperty({ default: new Date().toISOString() })
  expiryDate: Date
}
