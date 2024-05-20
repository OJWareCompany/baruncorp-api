/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TrackingNumbersResponseDto } from '@modules/tracking-numbers/dtos/tracking-numbers.response.dto'
import { PrismaService } from '@modules/database/prisma.service'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'

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
          courierId: record.courierId,
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
