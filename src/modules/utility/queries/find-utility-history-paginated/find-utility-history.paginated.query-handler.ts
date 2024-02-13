/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { UtilityResponseDto } from '../../dtos/utility.response.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../database/prisma.service'
import { UtilityHistoryResponseDto } from '@modules/utility/dtos/utility-history.response.dto'
import { UtilitySnapshotTypeEnum } from '@modules/utility/domain/utility-snapshot.type'

export class FindUtilityHistoryPaginatedQuery extends PaginatedQueryBase {
  readonly utilityId: string
  constructor(props: PaginatedParams<FindUtilityHistoryPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindUtilityHistoryPaginatedQuery)
export class FindUtilityHistoryPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindUtilityHistoryPaginatedQuery): Promise<Paginated<UtilityHistoryResponseDto>> {
    const condition: Prisma.UtilitySnapshotsWhereInput = {
      utilityId: query.utilityId,
    }

    const records = await this.prismaService.utilitySnapshots.findMany({
      where: condition,
      skip: query.offset,
      take: query.limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
      },
    })

    const totalCount: number = await this.prismaService.utilitySnapshots.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const dto: UtilityHistoryResponseDto = {
          id: record.id,
          userName: record.user.full_name,
          type: record.type,
          updatedAt: record.createdAt,
        }

        return dto
      }),
    })
  }
}
