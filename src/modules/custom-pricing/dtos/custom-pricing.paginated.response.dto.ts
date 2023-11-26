import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { CustomPricingResponseDto } from './custom-pricing.response.dto'

export class CustomPricingPaginatedResponseDto extends PaginatedResponseDto<CustomPricingResponseDto> {
  @ApiProperty({ type: CustomPricingResponseDto, isArray: true })
  items: readonly CustomPricingResponseDto[]
}
