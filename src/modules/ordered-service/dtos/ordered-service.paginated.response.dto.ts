import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../../src/libs/api/page.response.dto'
import { OrderedServiceResponse } from './ordered-service.response.dto'

export class OrderedServicePaginatedResponseDto extends PaginatedResponseDto<OrderedServiceResponse> {
  @ApiProperty({ type: OrderedServiceResponse, isArray: true })
  items: readonly OrderedServiceResponse[]
}
