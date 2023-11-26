import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { CustomPricings } from '@prisma/client'

/**
 * Remove interface after select fields
 */
export class CustomPricingResponseDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly id: string

  constructor(props: CustomPricingResponseDto) {
    initialize(this, props)
  }
  organizationId: string
  organizationName: string
  serviceId: string
  serviceName: string
  hasResidentialNewServiceTier: boolean
  hasResidentialRevisionPricing: boolean
  hasCommercialNewServiceTier: boolean
  hasFixedPricing: boolean
}
