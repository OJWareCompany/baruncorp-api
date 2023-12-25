import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { LicenseTypeEnum } from '../../dtos/license.response.dto'
import { States, UserLicense } from '@prisma/client'

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

  async execute(query: FindLicensePaginatedQuery): Promise<
    Paginated<{
      state: States
      licenses: UserLicense[]
    }>
  > {
    const states = await this.prismaService.states.findMany({
      skip: query.offset,
      take: query.limit,
    })

    const licenses = await this.prismaService.userLicense.findMany({
      where: {
        type: query.type,
      },
    })

    const totalCount = await this.prismaService.states.count()

    // const workers = await this.prismaService.user

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount,
      items: states.map((state) => {
        return {
          state: state,
          licenses: licenses.filter((license) => license.abbreviation === state.abbreviation),
        }
      }),
    })
  }
}
