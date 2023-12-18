import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LicenseTypeEnum } from '../../user-license.type'
import { Type } from 'class-transformer'

export class AppointUserLicenseRequestDto {
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: LicenseTypeEnum.Structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  readonly type: LicenseTypeEnum

  @ApiProperty({ default: 'ALASKA' })
  @IsString()
  readonly stateName: string

  @ApiProperty({ default: '2023-09-04T07:31:27.217Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly expiryDate: Date | null
}
