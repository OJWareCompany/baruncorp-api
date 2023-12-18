import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { LicenseResponseDto } from './license.response.dto'

export class LicensePaginatedResponseDto extends PaginatedResponseDto<LicenseResponseDto> {
  @ApiProperty({ type: LicenseResponseDto, isArray: true })
  items: readonly LicenseResponseDto[]
}
