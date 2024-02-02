/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { JobFolderPaginatedResponseDto } from '../../dtos/job-folder.paginated.response.dto'
import { JobStatusEnum } from '../../../../modules/ordered-job/domain/job.type'

export class FindNonCountedJobFoldersQuery extends PaginatedQueryBase {
  readonly fromDate?: Date | null
  readonly toDate?: Date | null

  constructor(props: PaginatedParams<FindNonCountedJobFoldersQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindNonCountedJobFoldersQuery)
export class FindNonCountedJobFoldersQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(query: FindNonCountedJobFoldersQuery): Promise<JobFolderPaginatedResponseDto> {
    const jobs = await this.prismaService.orderedJobs.findMany({
      select: {
        id: true,
        jobStatus: true,
        dateSentToClient: true,
      },
      where: {
        dateSentToClient: {
          gte: query.fromDate ?? new Date(),
          lte: query.toDate ?? new Date(),
        },
        jobStatus: JobStatusEnum.Sent_To_Client,
      },
    })

    const condition = {
      jobId: { in: jobs.map((job) => job.id) },
      count: null,
    }

    const nonCountedJobFolder = await this.prismaService.googleJobFolder.findMany({
      select: {
        id: true,
        jobId: true,
        sharedDriveId: true,
      },
      where: condition,
      orderBy: { sharedDriveId: 'asc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.googleJobFolder.count({ where: condition })

    return new Paginated({
      items: nonCountedJobFolder,
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
    })
  }
}
