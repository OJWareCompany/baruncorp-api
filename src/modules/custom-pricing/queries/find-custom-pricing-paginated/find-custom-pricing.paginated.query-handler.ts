import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CustomPricings } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindCustomPricingPaginatedQuery extends PaginatedQueryBase {
  readonly organizationId?: string | null
  readonly organizationName?: string | null
  readonly serviceId?: string | null
  readonly serviceName?: string | null
  constructor(props: PaginatedParams<FindCustomPricingPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindCustomPricingPaginatedQuery)
export class FindCustomPricingPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindCustomPricingPaginatedQuery): Promise<Paginated<CustomPricings>> {
    const result = await this.prismaService.customPricings.findMany({
      where: {
        ...(query.organizationId && { organizationId: query.organizationId }),
        ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
        ...(query.serviceId && { serviceId: query.serviceId }),
        ...(query.serviceName && { serviceName: { contains: query.serviceName } }),
      },
      skip: query.offset,
      take: query.limit,
    })
    const totalCount = await this.prismaService.customPricings.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
