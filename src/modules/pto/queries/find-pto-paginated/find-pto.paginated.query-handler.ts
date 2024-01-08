import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Ptos } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoMapper } from '../../pto.mapper'
import { PtoRepository } from '../../database/pto.repository'

export class FindPtoPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindPtoPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoPaginatedQuery)
export class FindPtoPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly ptoRepository: PtoRepository, private readonly ptoMapper: PtoMapper) {}

  async execute(query: FindPtoPaginatedQuery): Promise<Paginated<Ptos>> {
    const result: PtoEntity[] = await this.ptoRepository.findMany(query.offset, query.limit)
    if (!result) throw new NotFoundException()

    const totalCount: number = await this.ptoRepository.getCount()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.map((ptoEntity) => {
        return this.ptoMapper.toResponse(ptoEntity)
      }),
    })
  }
}
