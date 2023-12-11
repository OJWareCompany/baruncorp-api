/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { CustomPricingResponseDto } from '../../dtos/custom-pricing.response.dto'
import { FindCustomPricingRequestDto } from './find-custom-pricing.request.dto'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing.di-token'
import { CustomPricingRepositoryPort } from '../../database/custom-pricing.repository.port'
import { CustomPricingMapper } from '../../custom-pricing.mapper'
import { CustomPricingNotFoundException } from '../../domain/custom-pricing.error'

@Controller('custom-pricings')
export class FindCustomPricingHttpController {
  constructor(
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly mapper: CustomPricingMapper,
  ) {}

  @Get(':organizationId/:serviceId')
  async get(@Param() request: FindCustomPricingRequestDto): Promise<CustomPricingResponseDto> {
    const entity = await this.customPricingRepo.findOne(request.organizationId, request.serviceId)
    if (!entity) throw new CustomPricingNotFoundException()
    return this.mapper.toResponse(entity)
  }
}
