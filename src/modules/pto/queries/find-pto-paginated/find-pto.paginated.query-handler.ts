/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { PTO_REPOSITORY } from '../../pto.di-token'
import { PtoRepositoryPort } from '../../database/pto.repository.port'
import { Inject } from '@nestjs/common'

export class FindPtoPaginatedQuery extends PaginatedQueryBase {
  readonly userId?: string
  readonly userName?: string
  readonly isPaid?: boolean
  constructor(props: PaginatedParams<FindPtoPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoPaginatedQuery)
export class FindPtoPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(PTO_REPOSITORY)
    private readonly ptoRepository: PtoRepositoryPort,
  ) {}

  async execute(query: FindPtoPaginatedQuery) {
    const condition: Prisma.PtosWhereInput = {
      ...(query.userId && { userId: query.userId }),
      ...(query.userName && {
        user: {
          full_name: { contains: query.userName },
        },
      }),
      ...(query.isPaid !== null && query.isPaid !== undefined && { isPaid: query.isPaid }),
    }

    const entities: PtoEntity[] = await this.ptoRepository.findMany(condition, query.offset, query.limit)

    const totalCount: number = await this.ptoRepository.getCount(condition)
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: entities.map((entity) => {
        const props = entity.getProps()
        const ptoDtos: PtoResponseDto = {
          id: props.id,
          userDateOfJoining: props.dateOfJoining.toISOString(),
          userFirstName: props.targetUser ? props.targetUser.firstName : '',
          userLastName: props.targetUser ? props.targetUser.lastName : '',
          tenure: props.tenure,
          total: props.total,
          availablePto: entity.getUsablePtoValue(),
          isPaid: props.isPaid,
          startedAt: props.startedAt ? props.startedAt.toISOString() : '',
          endedAt: props.endedAt ? props.endedAt.toISOString() : '',
        }
        return ptoDtos
      }),
    })
  }
}
