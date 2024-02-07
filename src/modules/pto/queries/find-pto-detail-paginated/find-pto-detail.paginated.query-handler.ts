import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma, Ptos, Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoMapper } from '../../pto.mapper'
import { PtoDetailQueryModel, PtoRepository } from '../../database/pto.repository'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { PrismaService } from '../../../database/prisma.service'
import { PtoDetailResponseDto } from '../../dtos/pto-detail.response.dto'

export class FindPtoDetailPaginatedQuery extends PaginatedQueryBase {
  readonly userId?: string
  readonly userName?: string
  readonly targetMonth?: Date
  constructor(props: PaginatedParams<FindPtoDetailPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoDetailPaginatedQuery)
export class FindPtoDetailPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPtoDetailPaginatedQuery) {
    let condition: Prisma.PtoDetailsWhereInput = {
      ...(query.userId && {
        user: {
          id: query.userId,
        },
      }),
      ...(query.userName && {
        user: {
          full_name: { contains: query.userName },
        },
      }),
    }

    if (query.targetMonth) {
      const startDate = new Date(query.targetMonth)
      const endDate = new Date(query.targetMonth)

      endDate.setMonth(startDate.getMonth() + 1)
      endDate.setDate(0)

      condition = {
        ...condition,
        startedAt: {
          gte: startDate,
          lte: endDate,
        },
      }
    }

    const records: PtoDetailQueryModel[] = await this.prismaService.ptoDetails.findMany({
      where: condition,
      include: {
        //Todo. user의 필요 부분만 select
        user: true,
        pto: true,
        ptoType: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
      skip: query.offset,
      take: query.limit,
    })

    const totalCount = await this.prismaService.ptoDetails.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const ptoDetailDtos: PtoDetailResponseDto = {
          id: record.id,
          userFirstName: record.user.firstName,
          userLastName: record.user.lastName,
          startedAt: record.startedAt.toISOString().split('T')[0],
          endedAt: this.calcEndedAt(record.startedAt, record.days).toISOString().split('T')[0],
          days: record.days,
          amount: record.amount * record.days,
          ptoTypeId: record.ptoTypeId,
          ptoTypeName: record.ptoType.name,
        }

        return ptoDetailDtos
      }),
    })
  }

  private calcEndedAt(startedAt: Date, days: number): Date {
    const endedAt: Date = new Date(startedAt)
    endedAt.setDate(endedAt.getDate() + days)
    endedAt.setTime(endedAt.getTime() - 1)

    return endedAt
  }
}
