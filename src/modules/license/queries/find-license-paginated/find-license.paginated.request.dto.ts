import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'

export class FindLicensePaginatedRequestDto {
  @ApiProperty({ default: LicenseTypeEnum.structural, enum: LicenseTypeEnum })
  @IsEnum(LicenseTypeEnum)
  readonly type: LicenseTypeEnum
}
