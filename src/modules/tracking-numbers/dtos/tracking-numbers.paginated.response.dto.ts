import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { TrackingNumbersResponseDto } from './tracking-numbers.response.dto'

export class TrackingNumbersPaginatedResponseDto extends PaginatedResponseDto<TrackingNumbersResponseDto> {
  @ApiProperty({ type: TrackingNumbersResponseDto, isArray: true })
  items: readonly TrackingNumbersResponseDto[]
}
