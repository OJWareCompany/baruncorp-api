/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Informations, PtoTenurePolicies } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { ScheduleMapper } from '../../schedule.mapper'
import { ScheduleRepositoryPort } from '../../database/schedule.repository.port'
import { InformationPaginatedResponseDto } from '../../dtos/information.paginated.response.dto'
import { InformationResponseDto } from '../../dtos/information.response.dto'

export class FindInformationPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindInformationPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindInformationPaginatedQuery)
export class InformationPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly mapper: ScheduleMapper) {}

  async execute(query: FindInformationPaginatedQuery): Promise<Paginated<InformationResponseDto>> {
    // const result: ScheduleEntity[] = await this.informationRepository.findMany(query.offset, query.limit)
    // if (!result) throw new NotFoundException()

    // const totalCount: number = await this.informationRepository.getCount()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: 1,
      items: [],
    })
  }
}
