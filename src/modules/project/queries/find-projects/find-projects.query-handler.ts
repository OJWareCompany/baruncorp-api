import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { OrderedProjects, Organizations } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'

export class FindProjectsQuery extends PaginatedQueryBase {
  readonly propertyType: string | null

  readonly projectNumber: string | null

  readonly propertyFullAddress: string | null

  readonly organizationId: string | null

  constructor(props: PaginatedParams<FindProjectsQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindProjectsQuery)
export class FindProjectsQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */
  async execute(query: FindProjectsQuery): Promise<Paginated<{ organization: Organizations } & OrderedProjects>> {
    const records = await this.prismaService.orderedProjects.findMany({
      where: {
        ...(query.propertyType && { projectPropertyType: query.propertyType }),
        ...(query.projectNumber && { projectNumber: query.projectNumber }),
        ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
        ...(query.organizationId && { clientOrganizationId: { contains: query.organizationId } }),
      },
      include: {
        organization: true,
      },
      orderBy: { dateCreated: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.orderedProjects.count({
      where: {
        ...(query.propertyType && { projectPropertyType: query.propertyType }),
        ...(query.projectNumber && { projectNumber: query.projectNumber }),
        ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
        ...(query.organizationId && { clientOrganizationId: { contains: query.organizationId } }),
      },
    })

    return new Paginated({
      items: records,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
