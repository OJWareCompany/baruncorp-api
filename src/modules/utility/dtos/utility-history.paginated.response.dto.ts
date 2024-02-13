import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { UtilityResponseDto } from './utility.response.dto'
import { UtilityHistoryResponseDto } from '@modules/utility/dtos/utility-history.response.dto'

export class UtilityHistoryPaginatedResponseDto extends PaginatedResponseDto<UtilityHistoryResponseDto> {
  @ApiProperty({ type: UtilityHistoryResponseDto, isArray: true })
  items: readonly UtilityHistoryResponseDto[]
}
