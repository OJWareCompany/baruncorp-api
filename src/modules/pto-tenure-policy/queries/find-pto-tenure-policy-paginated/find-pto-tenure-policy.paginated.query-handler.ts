import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PtoTenurePolicies, Ptos } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoTenurePolicyRepository } from '../../database/pto-tenure-policy.repository'
import { PtoTenurePolicyMapper } from '../../pto-tenure-policy.mapper'
import { PtoTenurePolicyEntity } from '../../domain/pto-tenure-policy.entity'

export class FindPtoTenurePolicyPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindPtoTenurePolicyPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoTenurePolicyPaginatedQuery)
export class FindPtoTenurePolicyPaginatedQueryHandler implements IQueryHandler {
  constructor(
    private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepository,
    private readonly mapper: PtoTenurePolicyMapper,
  ) {}

  async execute(query: FindPtoTenurePolicyPaginatedQuery): Promise<Paginated<PtoTenurePolicies>> {
    const result: PtoTenurePolicyEntity[] = await this.ptoTenurePolicyRepository.findMany(query.offset, query.limit)
    if (!result) throw new NotFoundException()

    const totalCount: number = await this.ptoTenurePolicyRepository.getCount()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.map((ptoTenurePolicyEntity) => {
        return this.mapper.toResponse(ptoTenurePolicyEntity)
      }),
    })
  }
}
