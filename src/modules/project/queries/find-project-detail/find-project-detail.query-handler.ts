/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { ProjectNotFoundException } from '../../domain/project.error'

export class FindProjectDetailQuery {
  readonly id: string

  constructor(props: FindProjectDetailQuery) {
    this.id = props?.id
  }
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
  async execute(query: FindProjectDetailQuery): Promise<any> {
    try {
      const record = await this.prismaService.orderedProjects.findFirstOrThrow({
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

      record.jobs = record.jobs.map((job) => {
        return this.jobMapper.toDomain({ ...job }).getProps()
      }) as any // TODO: any

      // as JobProps // TODO: any
      const jobHasCurrentMailingAddress: any = record.jobs.find((props: any) => {
        return !!props.mailingAddressForWetStamp?.coordinates?.length
        // return props.jobStatus === 'Completed' && !!props.mailingAddressForWetStamp?.coordinates?.length
      })

      return {
        record,
        currentMailingAddress: jobHasCurrentMailingAddress?.mailingAddressForWetStamp,
      }
    } catch (error) {
      if (error.message === 'No OrderedProjects found') throw new ProjectNotFoundException()
      else throw error
    }
  }
}
