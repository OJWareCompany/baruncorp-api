import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Organizations, Prisma } from '@prisma/client'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindOrganizationPaginatedQuery extends PaginatedQueryBase {
  readonly name?: string | null
  readonly fullAddress?: string | null
  readonly email?: string | null
  readonly phoneNumber?: string | null
  readonly organizationType?: string | null
  readonly projectPropertyTypeDefaultValue?: string | null
  readonly mountingTypeDefaultValue?: string | null
  readonly isVendor?: boolean | null

  constructor(props: PaginatedParams<FindOrganizationPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindOrganizationPaginatedQuery)
export class FindOrganizationPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(query: FindOrganizationPaginatedQuery): Promise<Paginated<Organizations>> {
    const whereInput: Prisma.OrganizationsWhereInput = {
      ...(query.name && { name: { contains: query.name } }),
      ...(query.fullAddress && { fullAddress: { contains: query.fullAddress } }),
      ...(query.email && { email: { contains: query.email } }),
      ...(query.phoneNumber && { phoneNumber: { contains: query.phoneNumber } }),
      ...(query.organizationType && { organizationType: query.organizationType }),
      ...(query.projectPropertyTypeDefaultValue && {
        projectPropertyTypeDefaultValue: query.projectPropertyTypeDefaultValue,
      }),
      ...(query.mountingTypeDefaultValue && { mountingTypeDefaultValue: query.mountingTypeDefaultValue }),
      ...(query.isVendor !== null && query.isVendor !== undefined && { isVendor: query.isVendor }),
    }

    const records = await this.prismaService.organizations.findMany({
      where: whereInput,
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.organizations.count({
      where: whereInput,
    })

    return new Paginated({
      items: records,
      totalCount: totalCount,
      page: query.page,
      pageSize: query.limit,
    })
  }
}
