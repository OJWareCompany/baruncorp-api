/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Couriers, PtoTenurePolicies } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { CouriersRepositoryPort } from '@modules/couriers/database/couriers.repository.port'
import { PTO_TENURE_REPOSITORY } from '@modules/pto-tenure-policy/pto-tenure-policy.di-token'
import { PtoTenurePolicyMapper } from '@modules/pto-tenure-policy/pto-tenure-policy.mapper'
import { FindPtoTenurePolicyPaginatedQuery } from '@modules/pto-tenure-policy/queries/find-pto-tenure-policy-paginated/find-pto-tenure-policy.paginated.query-handler'
import { PtoTenurePolicyEntity } from '@modules/pto-tenure-policy/domain/pto-tenure-policy.entity'
import { CouriersMapper } from '@modules/couriers/couriers.mapper'
import { COURIERS_REPOSITORY } from '@modules/couriers/couriers.di-token'
import { CouriersEntity } from '@modules/couriers/domain/couriers.entity'
import { CouriersResponseDto } from '@modules/couriers/dtos/couriers.response.dto'

export class FindCouriersPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindCouriersPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindCouriersPaginatedQuery)
export class FindCouriersPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(COURIERS_REPOSITORY) private readonly couriersRepository: CouriersRepositoryPort,
    private readonly mapper: CouriersMapper,
  ) {}

  async execute(query: FindPtoTenurePolicyPaginatedQuery): Promise<Paginated<CouriersResponseDto>> {
    const result: CouriersEntity[] = await this.couriersRepository.findMany(query.offset, query.limit)
    if (!result) throw new NotFoundException()

    const totalCount: number = await this.couriersRepository.getCount()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.map((couriersEntity: CouriersEntity) => {
        return this.mapper.toResponse(couriersEntity)
      }),
    })
  }
}
