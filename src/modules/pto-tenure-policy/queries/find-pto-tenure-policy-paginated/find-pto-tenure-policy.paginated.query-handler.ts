/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PtoTenurePolicies } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoTenurePolicyMapper } from '../../pto-tenure-policy.mapper'
import { PtoTenurePolicyEntity } from '../../domain/pto-tenure-policy.entity'
import { PtoTenurePolicyRepositoryPort } from '../../database/pto-tenure-policy.repository.port'
import { PTO_TENURE_REPOSITORY } from '../../pto-tenure-policy.di-token'

export class FindPtoTenurePolicyPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindPtoTenurePolicyPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoTenurePolicyPaginatedQuery)
export class FindPtoTenurePolicyPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_TENURE_REPOSITORY) private readonly ptoTenurePolicyRepository: PtoTenurePolicyRepositoryPort,
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
