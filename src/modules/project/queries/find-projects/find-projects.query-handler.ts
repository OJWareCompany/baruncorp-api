import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { OrderedProjects } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { Paginated } from '../../../../libs/ddd/repository.port'

export class FindProjectsQuery extends PaginatedQueryBase {
  readonly propertyType?: string

  readonly projectNumber?: string

  readonly propertyAddress?: string

  constructor(props: PaginatedParams<FindProjectsQuery>) {
    super(props)
    this.propertyType = props.propertyType
    this.projectNumber = props.projectNumber
    this.propertyAddress = props.propertyAddress
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
  async execute(query: FindProjectsQuery): Promise<Paginated<OrderedProjects>> {
    const records = await this.prismaService.orderedProjects.findMany({
      where: {
        ...(query.propertyType && { projectPropertyType: query.propertyType }),
        ...(query.projectNumber && { projectNumber: query.projectNumber }),
        ...(query.propertyAddress && { propertyAddress: { contains: query.propertyAddress } }),
      },
      take: query.limit,
      skip: query.offset,
    })

    return new Paginated({
      items: records,
      totalCount: records.length,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
