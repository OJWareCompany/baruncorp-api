import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma, Ptos, Users } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PtoEntity } from '../../domain/pto.entity'
import { PtoMapper } from '../../pto.mapper'
import { PtoAnnualQueryModel, PtoDetailQueryModel, PtoRepository } from '../../database/pto.repository'
import { PtoResponseDto } from '../../dtos/pto.response.dto'
import { PrismaService } from '../../../database/prisma.service'
import { PtoAnnualResponseDto, PtoTypeInfo } from '../../dtos/pto-annual.response.dto'
import { PtoTypeAvailableValue, PtoTypeResponseDto } from '../../dtos/pto-type.response.dto'

export class FindPtoTypePaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindPtoTypePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoTypePaginatedQuery)
export class FindPtoTypePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPtoTypePaginatedQuery) {
    const ptoTypes = await this.prismaService.ptoTypes.findMany({
      skip: query.offset,
      take: query.limit,
      include: {
        ptoTypesAvailableValues: {
          include: {
            PtoAvailableValue: true,
          },
        },
      },
    })

    const totalCount = await this.prismaService.ptoTypes.count()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: ptoTypes.map((record) => {
        const ptoTypeAvailableValues: PtoTypeAvailableValue[] = []
        record.ptoTypesAvailableValues.map((mapping) => {
          ptoTypeAvailableValues.push(
            new PtoTypeAvailableValue({
              value: mapping.PtoAvailableValue.value,
            }),
          )
        })
        const ptoTypeResponseDto: PtoTypeResponseDto = {
          id: record.id,
          name: record.name,
          availableValues: ptoTypeAvailableValues,
        }
        return ptoTypeResponseDto
      }),
    })
  }
}
