import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Service } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { ServicePaginatedResponseDto } from '../../dtos/service.paginated.response.dto'
import { FindServicePaginatedQuery } from './find-service-paginated.query-handler'

@Controller('services')
export class FindServicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<ServicePaginatedResponseDto> {
    const command = new FindServicePaginatedQuery({
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<Service> = await this.queryBus.execute(command)

    return new ServicePaginatedResponseDto({
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        name: item.name,
        billingCode: item.billingCode,
        basePrice: Number(item.basePrice),
      })),
    })
  }
}
