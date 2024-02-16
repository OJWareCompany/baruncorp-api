/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { endOfMonth, startOfMonth } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Inject } from '@nestjs/common'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceStatusEnum } from '../../../ordered-service/domain/ordered-service.type'
import { CalculateInvoiceService } from '../../../invoice/domain/calculate-invoice-service.domain-service'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { PrismaService } from '../../../database/prisma.service'
import { JobToInvoiceResponseDto } from '../../dtos/job-to-invoice.response.dto'
import { JobResponseMapper } from '../../job.response.mapper'
import { JobStatusEnum } from '../../domain/job.type'

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
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly jobResponseMapper: JobResponseMapper,
    private readonly calcInvoiceService: CalculateInvoiceService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(query: FindJobToInvoiceQuery): Promise<JobToInvoiceResponseDto> {
    // // 입력받은 값을 UTC로 변환한다, Postman에서 한국 시간을 보내고(헤더에 명시), TimezoneOffset을 사용하여 UTC로 변환.
    // console.log(query.serviceMonth, '?') // 2023-05-31T14:00:00.000Z, PostMan Input: 2023-05-31 23:00:00
    // console.log(query.serviceMonth.getTimezoneOffset())

    // // 혹은.. UTC로 표현해주는 것
    // console.log(startOfMonth(query.serviceMonth)) // 입력받은 날짜를 로컬존으로 인식하여 한번 더 시간이 UTC로 변환됨 (중복해서 변환됨)?
    // console.log(startOfMonth(query.serviceMonth).getTimezoneOffset())

    // console.log(zonedTimeToUtc(startOfMonth(query.serviceMonth), 'Etc/UTC'))
    // console.log(zonedTimeToUtc(endOfMonth(query.serviceMonth), 'Etc/UTC'))

    const jobs = await this.prismaService.orderedJobs.findMany({
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

    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: { in: jobs.map((job) => job.id) } })
    const discount = await this.calcInvoiceService.calcDiscountAmount(orderedServices, this.serviceRepo)
    const total = orderedServices //
      .filter(
        (scope) =>
          scope.status === OrderedServiceStatusEnum.Completed ||
          scope.status === OrderedServiceStatusEnum.Canceled_Invoice,
      )
      .reduce((pre, cur) => pre + Number(cur.price), 0)

    return {
      items: await Promise.all(
        jobs.map(async (job) => {
          return await this.jobResponseMapper.toResponse(job)
        }),
      ),
      subtotal: total,
      discount: discount,
      total: total,
    }
  }
}
