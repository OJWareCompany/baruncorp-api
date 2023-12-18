import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'

export class FindLicensePaginatedQuery extends PaginatedQueryBase {
  readonly type: LicenseTypeEnum
  constructor(props: PaginatedParams<FindLicensePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindLicensePaginatedQuery)
export class FindLicensePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindLicensePaginatedQuery): Promise<Paginated<any>> {
    // const result = await this.prismaService.licenses.findMany({
    //   skip: query.offset,
    //   take: query.limit,
    // })
    // if (!result) throw new NotFoundException()
    // const totalCount = await this.prismaService.licenses.count()
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: 0,
      items: [],
    })
  }
}
