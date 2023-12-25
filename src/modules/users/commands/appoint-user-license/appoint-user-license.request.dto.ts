import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class AppointUserLicenseRequestParamDto {
  @ApiProperty({ default: 'AK' })
  @IsString()
  readonly abbreviation: string
}
export class AppointUserLicenseRequestDto {
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  readonly type: LicenseTypeEnum

  @ApiProperty({ default: '2023-09-04T07:31:27.217Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly expiryDate: Date | null
}
