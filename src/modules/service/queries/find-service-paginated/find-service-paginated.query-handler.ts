import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CommercialStandardPricingTiers, Service, Tasks } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { ServiceMapper } from '../../service.mapper'
import { ServiceEntity } from '../../domain/service.entity'
import { ServiceResponseDto } from '../../dtos/service.response.dto'

export class FindServicePaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindServicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindServicePaginatedQuery)
export class FindServicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly serviceMapper: ServiceMapper) {}

  async execute(query: FindServicePaginatedQuery): Promise<Paginated<ServiceResponseDto>> {
    const result = await this.prismaService.service.findMany({
      include: { tasks: true, commercialStandardPricingTiers: true },
      skip: query.offset,
      take: query.limit,
    })
    const entities = result.map((record) => {
      return this.serviceMapper.toDomain({
        service: record,
        commercialStandardPricingTiers: record.commercialStandardPricingTiers,
        tasks: record.tasks,
      })
    })
    const response = entities.map(this.serviceMapper.toResponse)

    const totalCount = await this.prismaService.service.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: response,
    })
  }
}
