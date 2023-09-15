/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
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
    try {
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

      // null이 나오는지 빈 배열이 나오는지 확인 필요

      // if (!record) throw new ProjectNotFoundException()
      // : OrderedJobs & { orderedTasks: OrderedTasks[] | null }
      // record.jobs = record.jobs?.map((job) => {
      //   return this.jobMapper.toDomain(job).getProps()
      // }) as any // TODO: any

      // as JobProps // TODO: any
      // const jobHasCurrentMailingAddress: any = record.jobs.find((props: any) => {
      //   return !!props.mailingAddressForWetStamp?.coordinates?.length
      //   // return props.jobStatus === 'Completed' && !!props.mailingAddressForWetStamp?.coordinates?.length
      // })

      return record
      // currentMailingAddress: jobHasCurrentMailingAddress?.mailingAddressForWetStamp,
    } catch (error) {
      if (error.message === 'No OrderedProjects found') throw new ProjectNotFoundException()
      else throw error
    }
  }
}

// type a = OrderedProjects & { organization: Organizations | null } & {
//   jobs: (OrderedJobs & { orderedTasks: OrderedTasks[] | null })[] | null
// }

// class Jobs implements JobProps {
//   @ApiProperty()
//   id: string
//   @ApiProperty()
//   projectId: string
//   @ApiProperty()
//   projectType: string
//   @ApiProperty()
//   mountingType: string
//   @ApiProperty()
//   jobName: string
//   @ApiProperty({ enum: JobStatusEnum, example: JobStatusEnum.In_Progress })
//   jobStatus: JobStatus
//   @ApiProperty()
//   propertyFullAddress: string
//   @ApiProperty()
//   isExpedited: boolean
//   @ApiProperty()
//   jobRequestNumber: number
//   @ApiProperty()
//   orderedTasks: OrderedTask[]
//   @ApiProperty()
//   systemSize: number
//   @ApiProperty()
//   @IsOptional()
//   mailingAddressForWetStamp: Address | null
//   @ApiProperty()
//   numberOfWetStamp: number
//   @ApiProperty()
//   additionalInformationFromClient: string
//   @ApiProperty()
//   clientInfo: ClientInformation
//   @ApiProperty()
//   updatedBy: string
//   @ApiProperty()
//   receivedAt: Date
//   @ApiProperty()
//   isCurrentJob?: boolean
// }
