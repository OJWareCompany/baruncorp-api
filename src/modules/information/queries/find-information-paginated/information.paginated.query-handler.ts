/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Informations, PtoTenurePolicies } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { InformationMapper } from '../../information.mapper'
import { InformationEntity } from '../../domain/information.entity'
import { INFORMATION_REPOSITORY } from '../../information.di-token'
import { InformationRepositoryPort } from '../../database/information.repository.port'
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
  constructor(
    // @ts-ignore
    @Inject(INFORMATION_REPOSITORY) private readonly informationRepository: InformationRepositoryPort,
    private readonly mapper: InformationMapper,
  ) {}

  async execute(query: FindInformationPaginatedQuery): Promise<Paginated<InformationResponseDto>> {
    const result: InformationEntity[] = await this.informationRepository.findMany(query.offset, query.limit)
    if (!result) throw new NotFoundException()

    const totalCount: number = await this.informationRepository.getCount()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result.map((informationEntity) => {
        return this.mapper.toResponse(informationEntity)
      }),
    })
  }
}
