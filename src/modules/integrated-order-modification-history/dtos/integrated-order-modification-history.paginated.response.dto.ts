import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { IntegratedOrderModificationHistoryResponseDto } from './integrated-order-modification-history.response.dto'

export class IntegratedOrderModificationHistoryPaginatedResponseDto extends PaginatedResponseDto<IntegratedOrderModificationHistoryResponseDto> {
  @ApiProperty({ type: IntegratedOrderModificationHistoryResponseDto, isArray: true })
  items: readonly IntegratedOrderModificationHistoryResponseDto[]
}
