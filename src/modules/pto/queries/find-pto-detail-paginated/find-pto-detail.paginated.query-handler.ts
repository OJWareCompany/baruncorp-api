import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma, Ptos, Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoMapper } from '../../pto.mapper'
import { PtoRepository } from '../../database/pto.repository'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { PrismaService } from '@src/modules/database/prisma.service'

export class FindPtoDetailPaginatedQuery extends PaginatedQueryBase {
  readonly userId?: string | null
  readonly startedAt?: Date | null
  readonly endedAt?: Date | null
  readonly userName?: string | null
  readonly isPaid?: boolean | null
  constructor(props: PaginatedParams<FindPtoDetailPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoDetailPaginatedQuery)
export class FindPtoPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPtoDetailPaginatedQuery) {
    // const result: PtoEntity[] = await this.ptoRepository.findMany(query.offset, query.limit)
    // if (!result) throw new NotFoundException()

    const condition: Prisma.PtoDetailsWhereInput = {
      ...(query.userId && { userId: query.userId }),
      ...(query.startedAt && { startedAt: query.startedAt }),
      ...(query.endedAt && { endedAt: query.endedAt }),
      ...(query.userName && { userName: query.userName }),
      ...(query.isPaid && { isPaid: query.isPaid }),
    }

    const records = await this.prismaService.ptoDetails.findMany({
      where: condition,
      // include: {
      //   user: true
      // },
      orderBy: { startedAt: 'desc' },
    })

    const totalCount = await this.prismaService.ptoDetails.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records,
    })
  }
}
