/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { UtilityResponseDto } from '../../dtos/utility.response.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../../database/prisma.service'

export class FindUtilityPaginatedQuery extends PaginatedQueryBase {
  readonly stateAbbreviation?: string
  constructor(props: PaginatedParams<FindUtilityPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindUtilityPaginatedQuery)
export class FindUtilityPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindUtilityPaginatedQuery): Promise<Paginated<UtilityResponseDto>> {
    const condition: Prisma.UtilitiesWhereInput = {
      ...(query.stateAbbreviation && { stateAbbreviations: { contains: query.stateAbbreviation } }),
    }

    const totalCount: number = await this.prismaService.utilities.count({ where: condition })

    const records = await this.prismaService.utilities.findMany({
      where: condition,
      skip: query.offset,
      take: query.limit,
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const dto: UtilityResponseDto = {
          id: record.id,
          name: record.name,
          stateAbbreviations: record.stateAbbreviations.split(','),
          notes: record.notes,
        }

        return dto
      }),
    })
  }
}
