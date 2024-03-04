import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Departments } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindDepartmentPaginatedQuery extends PaginatedQueryBase {
  readonly name?: string | null
  constructor(props: PaginatedParams<FindDepartmentPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindDepartmentPaginatedQuery)
export class FindDepartmentPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindDepartmentPaginatedQuery): Promise<Paginated<Departments>> {
    const result = await this.prismaService.departments.findMany({
      skip: query.offset,
      take: query.limit,
      where: {
        ...(query.name && { name: { contains: query.name } }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    const totalCount = await this.prismaService.departments.count({
      where: {
        ...(query.name && { name: { contains: query.name } }),
      },
    })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
