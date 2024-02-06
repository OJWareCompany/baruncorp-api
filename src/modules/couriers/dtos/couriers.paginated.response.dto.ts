import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { CouriersResponseDto } from './couriers.response.dto'

export class CouriersPaginatedResponseDto extends PaginatedResponseDto<CouriersResponseDto> {
  @ApiProperty({ type: CouriersResponseDto, isArray: true })
  items: readonly CouriersResponseDto[]
}
