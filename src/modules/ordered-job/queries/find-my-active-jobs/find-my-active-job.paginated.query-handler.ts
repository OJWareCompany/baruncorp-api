/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { TaskStatusEnum } from '../../../ordered-task/domain/ordered-task.type'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PrismaService } from '../../../database/prisma.service'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobProps } from '../../domain/job.type'
import { JobMapper } from '../../job.mapper'

export class FindMyActiveJobPaginatedQuery extends PaginatedQueryBase {
  readonly userId: string

  constructor(props: PaginatedParams<FindMyActiveJobPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindMyActiveJobPaginatedQuery)
export class FindMyActiveJobPaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(query: FindMyActiveJobPaginatedQuery): Promise<Paginated<JobProps>> {
    // TODO: totalcount때문에 풀스캔하게됨
    const myActiveTasks = await this.prismaService.orderedTasks.findMany({
      where: {
        assigneeUserId: query.userId,
        taskStatus: { in: [TaskStatusEnum.Not_Started, TaskStatusEnum.In_Progress] },
      },
      include: {
        job: true,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const jobIds = new Set()
    myActiveTasks.map((task) => jobIds.add(task.jobId))

    // TODO: totalcount때문에 풀스캔하게됨
    const records = await this.prismaService.orderedJobs.findMany({
      where: {
        id: { in: [...jobIds] as string[] },
      },
      include: {
        orderedTasks: true,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    })

    const totalCount = await this.prismaService.orderedJobs.count({ where: { id: { in: [...jobIds] as string[] } } })

    const result: JobProps[] = records.map((job) => ({ ...this.jobMapper.toDomain(job).getProps() }))

    return new Paginated({
      items: result,
      totalCount: totalCount,
      pageSize: query.limit,
      page: query.page,
    })
  }
}
