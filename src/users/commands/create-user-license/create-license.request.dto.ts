import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LicenseType } from '../../user-license.entity'

export class CreateLicenseRequestDto {
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: 'Electrical' })
  @IsString()
  readonly type: LicenseType

  @ApiProperty({ default: 'FLORIDA' })
  @IsString()
  readonly issuingCountryName: string

  @ApiProperty({ default: 'FL' })
  @IsString()
  readonly abbreviation: string

  @ApiProperty({ default: 9 })
  @IsNumber()
  readonly priority: number

  @ApiProperty({ default: new Date().toISOString() })
  @IsString()
  readonly issuedDate: Date

  @ApiProperty({ default: new Date().toISOString() })
  @IsString()
  readonly expiryDate: Date
}
