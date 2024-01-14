import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PtoDetailResponseDto } from './pto-detail.response.dto'

/**
 * Remove interface after select fields
 */
export class PtoDetailPaginatedResponseDto extends PaginatedResponseDto<PtoDetailResponseDto> {
  @ApiProperty({ type: PtoDetailResponseDto, isArray: true })
  readonly items: PtoDetailResponseDto[]
}
