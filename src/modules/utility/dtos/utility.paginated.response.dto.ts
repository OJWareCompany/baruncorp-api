import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { UtilityResponseDto } from './utility.response.dto'

export class UtilityPaginatedResponseDto extends PaginatedResponseDto<UtilityResponseDto> {
  @ApiProperty({ type: UtilityResponseDto, isArray: true })
  items: readonly UtilityResponseDto[]
}
