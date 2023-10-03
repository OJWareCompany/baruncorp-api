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
import { LineItem, TaskSizeEnum } from '../../../invoice/dtos/invoice.response.dto'
import {
  MountingType,
  MountingTypeEnum,
  ProjectPropertyType,
  ProjectPropertyTypeEnum,
} from '../../../project/domain/project.type'
import { OrderedServiceSizeForRevisionEnum } from '../../../ordered-service/domain/ordered-service.type'

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
    // // 입력받은 값을 UTC로 변환한다, Postman에서 한국 시간을 보내고(헤더에 명시), TimezoneOffset을 사용하여 UTC로 변환.
    // console.log(query.serviceMonth, '?') // 2023-05-31T14:00:00.000Z, PostMan Input: 2023-05-31 23:00:00
    // console.log(query.serviceMonth.getTimezoneOffset())

    // // 혹은.. UTC로 표현해주는 것
    // console.log(startOfMonth(query.serviceMonth)) // 입력받은 날짜를 로컬존으로 인식하여 한번 더 시간이 UTC로 변환됨 (중복해서 변환됨)?
    // console.log(startOfMonth(query.serviceMonth).getTimezoneOffset())

    // console.log(zonedTimeToUtc(startOfMonth(query.serviceMonth), 'Etc/UTC'))
    // console.log(zonedTimeToUtc(endOfMonth(query.serviceMonth), 'Etc/UTC'))

    const jobs = await this.prismaService.orderedJobs.findMany({
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

    let subtotal = 0
    jobs.map((job) => {
      job.orderedServices.map((orderedService) => (subtotal += Number(orderedService.price ?? 0)))
    })

    let total = 0
    jobs.map((job) => {
      job.orderedServices.map(
        (orderedService) => (total += Number((orderedService.priceOverride || orderedService.price) ?? 0)),
      )
    })

    // const jobs = records.map(this.jobMapper.toDomain)

    return await Promise.all(
      jobs.map(async (job) => {
        const isContainsRevisionTask = job.orderedServices.find((orderedService) => orderedService.isRevision)

        const sizeForRevision = job.orderedServices.find(
          (orderedService) =>
            orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Major,
        )
          ? TaskSizeEnum.Major
          : job.orderedServices.find(
              (orderedService) =>
                orderedService.isRevision && orderedService.sizeForRevision === OrderedServiceSizeForRevisionEnum.Minor,
            )
          ? TaskSizeEnum.Minor
          : null

        const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.projectId } })
        let stateName = 'unknown'
        if (project?.stateId) {
          console.log(project.stateId)
          const ahjnote = await this.prismaService.aHJNotes.findFirst({ where: { geoId: project.stateId } })
          stateName = ahjnote?.name || 'unknown'
        }

        return {
          jobRequestNumber: job.jobRequestNumber,
          description: job.jobName,
          dateSentToClient: job.updatedAt,
          mountingType: job.mountingType as MountingTypeEnum,
          clientOrganization: {
            id: job.clientOrganizationId,
            name: job.clientOrganizationName,
          },
          propertyType: job.projectType as ProjectPropertyTypeEnum,
          billingCodes: job.orderedServices.map((orderedService) => orderedService.service.billingCode),
          price: total,
          taskSubtotal: subtotal,

          // totalJobPriceOverride: null, // TODO: job필드 추가? -> X Job의 Service 가격을 수정하는 방식으로.
          state: stateName,
          containsRevisionTask: !!isContainsRevisionTask,
          taskSizeForRevision: sizeForRevision,
          pricingType: 'Standard', // TODO: 조직별 할인 작업 들어가야 할 수 있음
        }
      }),
    )
  }
}
