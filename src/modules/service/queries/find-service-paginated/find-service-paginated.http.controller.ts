import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { CommercialStandardPricingTiers, Service, Tasks } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { ServicePaginatedResponseDto } from '../../dtos/service.paginated.response.dto'
import { FindServicePaginatedQuery } from './find-service-paginated.query-handler'
import { ServicePricingTypeEnum } from '../../domain/service.type'
import { ServiceMapper } from '../../service.mapper'
import { ServiceResponseDto } from '../../dtos/service.response.dto'

@Controller('services')
export class FindServicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, serviceMapper: ServiceMapper) {}

  @Get()
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<ServicePaginatedResponseDto> {
    const command = new FindServicePaginatedQuery({
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<ServiceResponseDto> = await this.queryBus.execute(command)

    return new ServicePaginatedResponseDto({
      ...result,
      items: result.items,
    })
  }
}
