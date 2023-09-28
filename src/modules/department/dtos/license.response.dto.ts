import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { LicenseType } from '../../users/user-license.type'

export class LincenseResponseDto {
  @ApiProperty({ enum: LicenseType })
  readonly type: string

  @ApiProperty()
  readonly userName: string

  @ApiProperty()
  readonly issuingCountryName: string

  @ApiProperty()
  readonly abbreviation: string

  @ApiProperty()
  readonly priority: number | null

  @ApiProperty()
  readonly expiryDate: string | null

  constructor(create: LincenseResponseDto) {
    initialize(this, create)
  }
}
