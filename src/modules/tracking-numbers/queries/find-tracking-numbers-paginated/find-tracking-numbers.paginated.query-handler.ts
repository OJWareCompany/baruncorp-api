/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Couriers, Prisma, PtoTenurePolicies } from '@prisma/client'
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
import { TRACKING_NUMBERS_REPOSITORY } from '@modules/tracking-numbers/tracking-numbers.di-token'
import { TrackingNumbersRepositoryPort } from '@modules/tracking-numbers/database/tracking-numbers.repository.port'
import { TrackingNumbersMapper } from '@modules/tracking-numbers/tracking-numbers.mapper'
import { TrackingNumbersEntity } from '@modules/tracking-numbers/domain/tracking-numbers.entity'
import { PrismaService } from '@modules/database/prisma.service'
import { TrackingNumbersResponseDto } from '@modules/tracking-numbers/dtos/tracking-numbers.response.dto'

export class FindTrackingNumbersPaginatedQuery extends PaginatedQueryBase {
  readonly jobId?: string
  constructor(props: PaginatedParams<FindTrackingNumbersPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindTrackingNumbersPaginatedQuery)
export class FindTrackingNumbersPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindTrackingNumbersPaginatedQuery): Promise<Paginated<TrackingNumbersResponseDto>> {
    const condition: Prisma.TrackingNumbersWhereInput = {
      ...(query.jobId && { jobId: query.jobId }),
    }

    const records = await this.prismaService.trackingNumbers.findMany({
      where: condition,
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
        job: {
          select: {
            jobName: true,
          },
        },
        courier: {
          select: {
            name: true,
            trackingUrlParam: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const totalCount: number = await this.prismaService.trackingNumbers.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: records.map((record) => {
        const dto: TrackingNumbersResponseDto = {
          id: record.id,
          jobId: record.jobId,
          jobName: record.job.jobName,
          trackingNumberUri: `${record.courier.trackingUrlParam}${record.trackingNumber}`,
          courierName: record.courier.name,
          createdBy: record.user.full_name,
          trackingNumber: record.trackingNumber,
          createdAt: record.createdAt,
        }
        return dto
      }),
    })
  }
}
