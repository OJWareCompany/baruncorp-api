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
import { PrismaService } from '../../../database/prisma.service'

export class FindPtoPaginatedQuery extends PaginatedQueryBase {
  readonly userId?: string | null
  constructor(props: PaginatedParams<FindPtoPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoPaginatedQuery)
export class FindPtoPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPtoPaginatedQuery) {
    // const result: PtoEntity[] = await this.ptoRepository.findMany(query.offset, query.limit)
    // if (!result) throw new NotFoundException()

    const condition: Prisma.PtosWhereInput = {
      ...(query.userId && { userId: query.userId }),
    }

    const records = await this.prismaService.ptos.findMany({
      where: condition,
      // include: {
      //   user: true
      // },
      orderBy: { tenure: 'desc' },
    })

    const totalCount = await this.prismaService.ptos.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records,
    })
  }
}
