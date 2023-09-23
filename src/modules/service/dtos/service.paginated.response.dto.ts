import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { ServiceResponseDto } from './service.response.dto'

export class ServicePaginatedResponseDto extends PaginatedResponseDto<ServiceResponseDto> {
  @ApiProperty({ type: ServiceResponseDto, isArray: true })
  items: readonly ServiceResponseDto[]
}
