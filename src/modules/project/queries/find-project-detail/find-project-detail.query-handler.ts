/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { OrderedProjects } from '@prisma/client'
import { PrismaService } from '../../../database/prisma.service'
import { OrganizationModel } from '../../../../modules/organization/database/organization.repository'
import { JobMapper } from '../../../ordered-job/job.mapper'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'

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
  async execute(
    query: FindProjectDetailQuery,
  ): Promise<Partial<OrderedProjects> & { organization: Partial<OrganizationModel> }> {
    try {
      console.log(2)
      const record = await this.prismaService.orderedProjects.findFirstOrThrow({
        where: { id: query.id },
        select: {
          id: true,
          systemSize: true,
          isGroundMount: true,
          projectPropertyType: true,
          propertyOwnerName: true,
          clientOrganizationId: true,
          projectFolder: true,
          mailingAddressForWetStamps: true, // Remove
          propertyAddress: true,
          numberOfWetStamps: true,
          projectNumber: true,
          dateCreated: true,
          totalOfJobs: true,
          masterLogUpload: true,
          designOrPeStampPreviouslyDoneOnProjectOutside: true,
          coordinates: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          jobs: {
            include: { orderedTasks: true },
          },
        },
      })

      if (!record) throw new NotFoundException('No OrderedProjects found', '30001')

      // record.coordinates = record.coordinates.split(',').map((n) => Number(n)) as any
      record.jobs = record.jobs.map((job) => {
        const jobEntity = this.jobMapper.toDomain({ ...job })
        return {
          ...jobEntity.getProps(),
        }
      }) as any

      return record
    } catch (error) {
      if (error.message === 'No OrderedProjects found') throw new NotFoundException('No OrderedProjects found', '30001')
      else throw error
    }
  }
}
