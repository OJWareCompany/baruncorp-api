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
  constructor(private readonly ptoRepository: PtoRepository) {}

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

    const totalCount = await this.ptoRepository.getCount(condition)

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: entities.map((entity) => {
        const props = entity.getProps()
        const ptoDtos: PtoResponseDto = {
          id: props.id,
          userDateOfJoining: props.dateOfJoining.toISOString().split('T')[0],
          userFirstName: props.targetUser ? props.targetUser.firstName : '',
          userLastName: props.targetUser ? props.targetUser.lastName : '',
          tenure: props.tenure,
          total: props.total,
          availablePto: entity.getUsablePtoValue(),
          isPaid: props.isPaid,
          startedAt: props.startedAt ? props.startedAt.toISOString().split('T')[0] : '',
          endedAt: props.endedAt ? props.endedAt.toISOString().split('T')[0] : '',
        }
        return ptoDtos
      }),
    })
  }
}
