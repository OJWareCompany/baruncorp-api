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

export class FindPtoAnnualPaginatedQuery extends PaginatedQueryBase {
  readonly targetYear: Date
  constructor(props: PaginatedParams<FindPtoAnnualPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindPtoAnnualPaginatedQuery)
export class FindPtoAnnualPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPtoAnnualPaginatedQuery) {
    const year = query.targetYear.getUTCFullYear()
    // 해당 연도의 시작일 (1월 1일) - UTC 기준
    const startDate = new Date(Date.UTC(year, 0, 1))
    // 해당 연도의 종료일 (12월 31일) - UTC 기준
    const endDate = new Date(Date.UTC(year + 1, 0, 0))

    const condition = {
      // Todo. 추후 PTO를 가질 수 있는 유저 권한 조건 추가
      dateOfJoining: {
        not: null,
      },
    }

    const users = await this.prismaService.users.findMany({
      skip: query.offset,
      take: query.limit,
      orderBy: {
        firstName: 'asc',
      },
      where: condition,
      select: { id: true, firstName: true, lastName: true },
    })

    const finalRecords = await Promise.all(
      users.map(async (user) => {
        const userPtoDetails = await this.prismaService.ptoDetails.findMany({
          where: {
            userId: user.id,
            startedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            ptoType: true,
          },
        })

        const ptoSummary: PtoTypeInfo[] = userPtoDetails.map((detail) => ({
          ptoTypeId: detail.ptoType.id,
          ptoTypeName: detail.ptoType.name,
          totalAmount: detail.amount * detail.days,
        }))

        const userTotalAmount = ptoSummary.reduce((sum, detail) => sum + detail.totalAmount, 0)

        return {
          userId: user.id,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          ptoTypes: ptoSummary,
          userTotalAmount,
        }
      }),
    )

    console.log(JSON.stringify(finalRecords))

    const totalCount = await this.prismaService.users.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: finalRecords.map((record) => {
        const ptoTypeInfo = record.ptoTypes.map(
          (ptoType) =>
            new PtoTypeInfo({
              ptoTypeId: ptoType.ptoTypeId,
              ptoTypeName: ptoType.ptoTypeName,
              totalAmount: ptoType.totalAmount,
            }),
        )
        const ptoAnnualDtos: PtoAnnualResponseDto = {
          userId: record.userId,
          userFirstName: record.userFirstName,
          userLastName: record.userLastName,
          totalAmount: record.userTotalAmount,
          ptoTypeInfos: ptoTypeInfo,
        }
        return ptoAnnualDtos
      }),
    })
  }
}
