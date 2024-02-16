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
import { FindInvoiceOverduePaginatedRequestDto } from './find-overdue-invoices.paginated.request.dto'

@Controller('overdue-invoices')
export class FindOverdueInvoicePaginatedHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jobResponseMapper: JobResponseMapper,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
  ) {}

  @Get('')
  async get(
    @Query() queryParams: PaginatedQueryRequestDto,
    @Query() request: FindInvoiceOverduePaginatedRequestDto,
  ): Promise<InvoicePaginatedResponseDto> {
    const command = new FindOverdueInvoicePaginatedQuery({
      ...queryParams,
      organizationName: request.organizationName,
      clientOrganizationId: request.clientOrganizationId,
    })
    const result: FindOverdueInvoicePaginatedReturnType = await this.queryBus.execute(command)

    return new InvoicePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: await Promise.all(
        result.items.map(async (invoice) => {
          // const payments = await this.
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
            subtotal: Number(invoice.subTotal),
            total: Number(invoice.total),
            discount: Number(invoice.discount),
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
            totalOfPayment: Number(invoice.paymentTotal),
          }
        }),
      ),
    })
  }
}
