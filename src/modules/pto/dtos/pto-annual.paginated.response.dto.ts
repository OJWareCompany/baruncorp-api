import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { PtoDetailResponseDto } from './pto-detail.response.dto'
import { PtoAnnualResponseDto } from './pto-annual.response.dto'

/**
 * Remove interface after select fields
 */
export class PtoAnnualPaginatedResponseDto extends PaginatedResponseDto<PtoAnnualResponseDto> {
  @ApiProperty({ type: PtoAnnualResponseDto, isArray: true })
  readonly items: PtoAnnualResponseDto[]
}
