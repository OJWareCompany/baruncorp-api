import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../users/user-license.type'

export class LicenseResponseDto {
  @ApiProperty({ enum: LicenseTypeEnum })
  readonly type: string

  @ApiProperty()
  readonly ownerName: string

  @ApiProperty()
  readonly issuingCountryName: string

  @ApiProperty()
  readonly abbreviation: string

  @ApiProperty()
  readonly priority: number | null

  @ApiProperty()
  readonly expiryDate: string | null

  constructor(create: LicenseResponseDto) {
    initialize(this, create)
  }
}
