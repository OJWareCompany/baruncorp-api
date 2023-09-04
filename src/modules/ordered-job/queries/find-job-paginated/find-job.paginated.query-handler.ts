import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobProps } from '../../domain/job.type'
import { JobMapper } from '../../job.mapper'

export class FindJobPaginatedQuery extends PaginatedQueryBase {
  readonly propertyType?: string

  readonly jobName?: string

  readonly projectId?: string

  constructor(props: PaginatedParams<FindJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindJobPaginatedQuery)
export class FindJobPaginatedQueryHandler implements IQueryHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(query: FindJobPaginatedQuery): Promise<Paginated<JobProps>> {
    // TODO: totalcount때문에 풀스캔하게됨
    const records = await this.prismaService.orderedJobs.findMany({
      where: {
        ...(query.propertyType && { projectType: query.propertyType }),
        ...(query.jobName && { jobName: { contains: query.jobName } }),
        ...(query.projectId && { projectId: { contains: query.projectId } }),
      },
      include: {
        orderedTasks: true,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.orderedJobs.count({
      where: {
        ...(query.propertyType && { projectType: query.propertyType }),
        ...(query.jobName && { jobName: { contains: query.jobName } }),
        ...(query.projectId && { projectId: { contains: query.projectId } }),
      },
    })

    const result: JobProps[] = records.map((job) => ({ ...this.jobMapper.toDomain(job).getProps() }))

    return new Paginated({
      items: result,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
