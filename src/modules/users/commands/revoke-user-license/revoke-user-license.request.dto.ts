/**
 * is record's primary key okay to expose?
 * https://softwareengineering.stackexchange.com/questions/218306/why-not-expose-a-primary-key
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { LicenseTypeEnum } from '../../user-license.type'

export class RevokeUserLicenseRequestParamDto {
  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly userId: string

  @ApiProperty({ default: 'ALASKA' })
  @IsString()
  readonly stateName: string
}

export class RevokeUserLicenseRequestDto {
  @ApiProperty({ default: 'Electrical' })
  @IsString()
  readonly type: LicenseTypeEnum
}
