/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceStatusEnum } from '../../../ordered-service/domain/ordered-service.type'
import { CalculateInvoiceService } from '../../../invoice/domain/calculate-invoice-service.domain-service'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { JobToInvoiceResponseDto } from '../../dtos/job-to-invoice.response.dto'
import { JobResponseMapper } from '../../job.response.mapper'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobMapper } from '../../job.mapper'
import { TieredPricingCalculator } from '../../../ordered-service/domain/domain-services/tiered-pricing-calculator.domain-service'
import { JobToInvoiceResponseMapper } from '../../job-to-invoice.response.mapper'

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
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly jobToInvoiceResponseMapper: JobToInvoiceResponseMapper,
    private readonly jobMapper: JobMapper,
    private readonly calcInvoiceService: CalculateInvoiceService,
    private readonly tieredPricingCalculator: TieredPricingCalculator,
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

    const jobs = await this.jobRepo.findJobsToInvoice(query.clientOrganizationId, query.serviceMonth)

    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: { in: jobs.map((job) => job.id) } })
    const calcCost = orderedServices.map(
      async (orderedService) => await orderedService.determinePriceWhenInvoice(this.tieredPricingCalculator),
    )
    await Promise.all(calcCost)
    const discount = await this.calcInvoiceService.calcDiscountAmount(orderedServices, this.serviceRepo)
    const total = orderedServices.reduce((pre, cur) => pre + Number(cur.price), 0)

    return {
      items: await Promise.all(
        jobs.map(async (job) => {
          return await this.jobToInvoiceResponseMapper.toResponse(this.jobMapper.toPersistence(job))
        }),
      ),
      subtotal: total,
      discount: discount,
      total: total,
    }
  }
}
