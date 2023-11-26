import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { CustomPricings } from '@prisma/client'
import { CustomPricingResponseDto } from '../../dtos/custom-pricing.response.dto'
import { FindCustomPricingRequestDto } from './find-custom-pricing.request.dto'
import { FindCustomPricingQuery } from './find-custom-pricing.query-handler'

@Controller('custom-pricings')
export class FindCustomPricingHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':customPricingId')
  async get(@Param() request: FindCustomPricingRequestDto): Promise<CustomPricingResponseDto> {
    const command = new FindCustomPricingQuery(request)

    const result: CustomPricings = await this.queryBus.execute(command)

    return new CustomPricingResponseDto({
      id: '',
      organizationId: '',
      organizationName: '',
      serviceId: '',
      serviceName: '',
      hasResidentialNewServiceTier: true,
      hasResidentialRevisionPricing: true,
      hasCommercialNewServiceTier: true,
      hasFixedPricing: true,
    })
  }
}
