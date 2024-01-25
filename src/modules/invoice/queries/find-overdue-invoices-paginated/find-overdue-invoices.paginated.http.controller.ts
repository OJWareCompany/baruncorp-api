/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Inject, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { InvoicePaginatedResponseDto } from '../../dtos/invoice.paginated.response.dto'
import {
  FindOverdueInvoicePaginatedQuery,
  FindOverdueInvoicePaginatedReturnType,
} from './find-overdue-invoices.paginated.query-handler'
import { JobResponseMapper } from '../../../ordered-job/job.response.mapper'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'

@Controller('overdue-invoices')
export class FindOverdueInvoicePaginatedHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jobResponseMapper: JobResponseMapper,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
  ) {}

  @Get('')
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<InvoicePaginatedResponseDto> {
    const command = new FindOverdueInvoicePaginatedQuery({
      ...queryParams,
    })
    const result: FindOverdueInvoicePaginatedReturnType = await this.queryBus.execute(command)

    return new InvoicePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: await Promise.all(
        result.items.map(async (invoice) => {
          let subtotal = 0
          let total = 0

          await Promise.all(
            invoice.jobs.map(async (job) => {
              const eachSubtotal = await this.jobRepo.getSubtotalInvoiceAmount(job.id)
              const eachTotal = await this.jobRepo.getTotalInvoiceAmount(job.id)
              subtotal += eachSubtotal
              total += eachTotal
            }),
          )

          return {
            id: invoice.id,
            status: invoice.status,
            invoiceDate: invoice.invoiceDate.toISOString(),
            terms: invoice.terms,
            dueDate: invoice.dueDate!.toISOString(),
            notesToClient: invoice.notesToClient,
            createdAt: invoice.createdAt.toISOString(),
            updatedAt: invoice.updatedAt.toISOString(),
            servicePeriodDate: invoice.serviceMonth.toISOString(),
            subtotal,
            total,
            discount: subtotal - total,
            clientOrganization: {
              id: invoice.organization.id,
              name: invoice.organization.name,
            },
            lineItems: await Promise.all(
              invoice.jobs.map(async (job) => {
                return await this.jobResponseMapper.toResponse(job)
              }),
            ),
            payments: [],
            totalOfPayment: 0,
          }
        }),
      ),
    })
  }
}
