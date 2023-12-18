import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'

export class FindLicenseRequestParamDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly stateName: string
}

export class FindLicenseRequestQueryDto {
  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  readonly type: LicenseTypeEnum
}
