/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { zonedTimeToUtc } from 'date-fns-tz'
import { endOfMonth, startOfMonth } from 'date-fns'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { JobStatusEnum } from '../../domain/job.type'
import { PrismaService } from '../../../database/prisma.service'
import { JobToInvoiceResponseDto } from '../../dtos/job-to-invoice.response.dto'
import { JobResponseMapper } from '../../job.response.mapper'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { Inject } from '@nestjs/common'

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
    private readonly prismaService: PrismaService,
    private readonly jobResponseMapper: JobResponseMapper,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
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

    let subtotal = 0
    let total = 0

    await Promise.all(
      jobs.map(async (job) => {
        const eachSubtotal = await this.jobRepo.getSubtotalInvoiceAmount(job.id)
        const eachTotal = await this.jobRepo.getTotalInvoiceAmount(job.id)
        subtotal += eachSubtotal
        total += eachTotal
      }),
    )

    return {
      items: await Promise.all(
        jobs.map(async (job) => {
          return await this.jobResponseMapper.toResponse(job)
        }),
      ),
      subtotal: subtotal,
      discount: subtotal - total,
      total: total,
    }
  }
}
