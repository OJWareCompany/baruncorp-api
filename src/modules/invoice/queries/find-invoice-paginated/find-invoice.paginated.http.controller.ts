import { Controller, Get, Inject, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { InvoicePaginatedResponseDto } from '../../dtos/invoice.paginated.response.dto'
import { FindInvoicePaginatedQuery, FindInvoicePaginatedReturnType } from './find-invoice.paginated.query-handler'
import { FindInvoicePaginatedRequestDto } from './find-invoice.paginated.request.dto'
import { JobResponseMapper } from '../../../ordered-job/job.response.mapper'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
/* eslint-disable @typescript-eslint/ban-ts-comment */

@Controller('invoices')
export class FindInvoicePaginatedHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly jobResponseMapper: JobResponseMapper,
  ) {}

  @Get('')
  async get(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Query() request: FindInvoicePaginatedRequestDto,
  ): Promise<InvoicePaginatedResponseDto> {
    const command = new FindInvoicePaginatedQuery({
      ...queryParams,
      status: request.status,
      organizationName: request.organizationName,
      invoiceDate: request.invoiceDate,
    })
    const result: FindInvoicePaginatedReturnType = await this.queryBus.execute(command)

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
            invoiceName: invoice.invoiceDate.toISOString(),
            status: invoice.status,
            invoiceDate: invoice.invoiceDate.toISOString(),
            terms: invoice.terms,
            dueDate: invoice.dueDate!.toISOString(),
            notesToClient: invoice.notesToClient,
            createdAt: invoice.createdAt.toISOString(),
            updatedAt: invoice.updatedAt.toISOString(),
            servicePeriodDate: invoice.serviceMonth.toISOString(),
            subtotal: subtotal,
            total: total,
            discount: subtotal - total,
            clientOrganization: {
              id: invoice.organization.id,
              name: invoice.organization.name,
            },
            lineItems: await Promise.all(invoice.jobs.map(async (job) => await this.jobResponseMapper.toResponse(job))),
            payments: [],
            totalOfPayment: 0,
          }
        }),
      ),
    })
  }
}
