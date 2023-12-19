import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { OrderedServiceResponseDto } from './ordered-service.response.dto'

export class OrderedServicePaginatedResponseDto extends PaginatedResponseDto<OrderedServiceResponseDto> {
  @ApiProperty({ type: OrderedServiceResponseDto, isArray: true })
  items: readonly OrderedServiceResponseDto[]
}
