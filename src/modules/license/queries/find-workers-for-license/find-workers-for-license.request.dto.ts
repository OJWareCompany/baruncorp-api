import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'

export class FindWorkersForLicenseRequestParamDto {
  @ApiProperty({ default: 'AK' })
  @IsString()
  readonly abbreviation: string
}

export class FindWorkersForLicenseRequestDto {
  @ApiProperty({ default: LicenseTypeEnum.structural })
  @IsEnum(LicenseTypeEnum)
  readonly type: LicenseTypeEnum
}
