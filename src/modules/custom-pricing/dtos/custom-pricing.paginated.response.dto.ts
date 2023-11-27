import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { CustomPricingResponseDto } from './custom-pricing.response.dto'

class CustomPricingPaginatedResponseDtoFields {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  organizationId: string

  @ApiProperty()
  @IsString()
  organizationName: string

  @ApiProperty()
  @IsString()
  serviceId: string

  @ApiProperty()
  @IsString()
  serviceName: string

  @ApiProperty()
  @IsString()
  hasResidentialNewServiceTier: boolean

  @ApiProperty()
  @IsString()
  hasResidentialRevisionPricing: boolean

  @ApiProperty()
  @IsString()
  hasCommercialNewServiceTier: boolean

  @ApiProperty()
  @IsString()
  hasFixedPricing: boolean
}

export class CustomPricingPaginatedResponseDto extends PaginatedResponseDto<CustomPricingPaginatedResponseDtoFields> {
  @ApiProperty({ type: CustomPricingPaginatedResponseDtoFields, isArray: true })
  items: readonly CustomPricingPaginatedResponseDtoFields[]
}
