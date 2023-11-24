import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { CommercialStandardPricingTiers, Service, Tasks } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { ServicePaginatedResponseDto } from '../../dtos/service.paginated.response.dto'
import { FindServicePaginatedQuery } from './find-service-paginated.query-handler'
import { ServicePricingTypeEnum } from '../../domain/service.type'

@Controller('services')
export class FindServicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<ServicePaginatedResponseDto> {
    const command = new FindServicePaginatedQuery({
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<
      Service & { tasks: Tasks[]; commercialStandardPricingTiers: CommercialStandardPricingTiers[] }
    > = await this.queryBus.execute(command)

    return new ServicePaginatedResponseDto({
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        name: item.name,
        billingCode: item.billingCode,
        pricingType: item.fixedPrice ? ServicePricingTypeEnum.fixed : ServicePricingTypeEnum.standard,
        standardPricing: {
          residentialPrice: item.basePrice ? Number(item.basePrice) : null,
          residentialGmPrice: item.gmPrice ? Number(item.gmPrice) : null,
          residentialRevisionPrice: item.revisionPrice ? Number(item.revisionPrice) : null,
          residentialRevisionGmPrice: item.revisionGmPrice ? Number(item.revisionGmPrice) : null,
          commercialRevisionCostPerUnit: item.commercialRevisionCostPerUnit
            ? Number(item.commercialRevisionCostPerUnit)
            : null,
          commercialRevisionMinutesPerUnit: item.commercialRevisionMinutesPerUnit
            ? Number(item.commercialRevisionMinutesPerUnit)
            : null,
          commercialNewServiceTiers: item.commercialStandardPricingTiers.map((tier) => ({
            startingPoint: Number(tier.startingPoint),
            finishingPoint: Number(tier.finishingPoint),
            price: Number(tier.price),
            gmPrice: Number(tier.gmPrice),
          })),
        },
        fixedPrice: item.fixedPrice ? Number(item.fixedPrice) : null,
        relatedTasks: item.tasks,
      })),
    })
  }
}
