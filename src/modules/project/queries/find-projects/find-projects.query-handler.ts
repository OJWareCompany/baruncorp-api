import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { OrderedProjects, Organizations, Prisma } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ProjectPropertyTypeEnum } from '../../domain/project.type'

export class FindProjectsQuery extends PaginatedQueryBase {
  readonly organizationId?: string | null
  readonly organizationName?: string | null
  readonly projectNumber?: string | null
  readonly projectPropertyOwner?: string | null
  readonly propertyFullAddress?: string | null
  readonly propertyType?: ProjectPropertyTypeEnum | null

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
  async execute(
    query: FindProjectsQuery,
  ): Promise<Paginated<{ organization: Organizations | null } & OrderedProjects>> {
    const condition: Prisma.OrderedProjectsWhereInput = {
      ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
      ...(query.projectNumber && { project_number: { contains: query.projectNumber } }),
      ...(query.propertyFullAddress && { propertyFullAddress: { contains: query.propertyFullAddress } }),
      ...(query.projectPropertyOwner && { propertyOwnerName: { contains: query.projectPropertyOwner } }),
      ...(query.propertyType && { projectPropertyType: query.propertyType }),
      ...(query.organizationId && { clientOrganizationId: query.organizationId }),
    }

    const records: ({
      organization: Organizations | null
    } & OrderedProjects)[] = await this.prismaService.orderedProjects.findMany({
      where: condition,
      include: {
        organization: true,
      },
      orderBy: { dateCreated: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.orderedProjects.count({ where: condition })

    return new Paginated({
      pageSize: query.limit,
      page: query.page,
      items: records,
      totalCount: totalCount,
    })
  }
}
