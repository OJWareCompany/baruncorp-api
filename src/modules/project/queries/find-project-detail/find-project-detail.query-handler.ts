/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { ProjectNotFoundException } from '../../domain/project.error'
import { OrderedJobs, OrderedProjects, OrderedTasks, Organizations } from '@prisma/client'

export class FindProjectDetailQuery {
  readonly id: string

  constructor(props: FindProjectDetailQuery) {
    this.id = props?.id
  }
}

export type FindProjectDetailReturnType = OrderedProjects & { organization: Organizations | null } & {
  jobs: (OrderedJobs & { orderedTasks: OrderedTasks[] })[]
}

@QueryHandler(FindProjectDetailQuery)
export class FindProjectDetailQueryHandler implements IQueryHandler {
  constructor(
    private readonly prismaService: PrismaService,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly jobMapper: JobMapper,
  ) {}

  /**
   * In read model we don't need to execute
   * any business logic, so we can bypass
   * domain and repository layers completely
   * and execute query directly
   */

  async execute(query: FindProjectDetailQuery): Promise<FindProjectDetailReturnType> {
    const record: FindProjectDetailReturnType = await this.prismaService.orderedProjects.findFirstOrThrow({
      where: { id: query.id },
      include: {
        organization: true,
        jobs: {
          include: {
            orderedTasks: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    if (!record) throw new ProjectNotFoundException()
    return record
  }
}
