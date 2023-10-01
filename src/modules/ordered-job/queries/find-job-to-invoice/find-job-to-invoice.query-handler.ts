/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobStatusEnum } from '../../domain/job.type'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobMapper } from '../../job.mapper'
import { PrismaService } from '../../../database/prisma.service'
import { LineItem } from '../../../invoice/dtos/invoice.response.dto'
import {
  MountingType,
  MountingTypeEnum,
  ProjectPropertyType,
  ProjectPropertyTypeEnum,
} from '../../../project/domain/project.type'

export class FindJobToInvoiceQuery {
  readonly clientOrganizationId: string
  readonly serviceMonth: Date
  constructor(props: FindJobToInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindJobToInvoiceQuery)
export class FindJobToInvoiceQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly prismaService: PrismaService,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(query: FindJobToInvoiceQuery): Promise<LineItem[]> {
    const records = await this.prismaService.orderedJobs.findMany({
      include: {
        orderedServices: {
          include: {
            service: true,
            assignedTasks: {
              include: {
                task: true,
                user: true,
              },
            },
          },
        },
      },
      where: {
        clientOrganizationId: query.clientOrganizationId,
        createdAt: {
          gte: zonedTimeToUtc(startOfMonth(query.serviceMonth), 'Etc/UTC'),
          lte: zonedTimeToUtc(endOfMonth(query.serviceMonth), 'Etc/UTC'),
        },
        jobStatus: JobStatusEnum.Completed,
        invoice: null,
      },
    })

    const jobs = records.map(this.jobMapper.toDomain)

    console.log(jobs)

    return jobs.map((job) => ({
      jobRequestNumber: job.getProps().jobRequestNumber,
      description: job.getProps().jobName,
      dateSentToClient: job.getProps().updatedAt,
      mountingType:
        (job.getProps().mountingType as MountingType) === 'Ground Mount'
          ? MountingTypeEnum.Ground_Mount
          : (job.getProps().mountingType as MountingType) === 'Roof Mount'
          ? MountingTypeEnum.Roof_Mount
          : MountingTypeEnum.RG_Mount,
      totalJobPriceOverride: null, // TODO: job필드 추가?
      clientOrganization: {
        id: job.getProps().clientInfo.clientOrganizationId,
        name: job.getProps().clientInfo.clientOrganizationName,
      },
      containsRevisionTask: false, // TODO
      propertyType:
        (job.getProps().projectType as ProjectPropertyType) === 'Commercial'
          ? ProjectPropertyTypeEnum.Commercial
          : ProjectPropertyTypeEnum.Residential,
      state: 'California (Mock)', // TODO
      billingCodes: job.billingCodes,
      taskSizeForRevision: 'Minor', // TODO
      pricingType: 'Standard', // TODO
      price: job.total,
      taskSubtotal: job.subtotal,
    }))
  }
}
