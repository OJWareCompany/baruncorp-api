import { Controller, Get, Inject, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { JobResponseMapper } from '../../../ordered-job/job.response.mapper'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { InvoicePaginatedResponseDto } from '../../dtos/invoice.paginated.response.dto'
import { FindInvoicePaginatedQuery, FindInvoicePaginatedReturnType } from './find-invoice.paginated.query-handler'
import { FindInvoicePaginatedRequestDto } from './find-invoice.paginated.request.dto'
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
      clientOrganizationId: request.clientOrganizationId,
    })
    const result: FindInvoicePaginatedReturnType = await this.queryBus.execute(command)

    return new InvoicePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: await Promise.all(
        result.items.map(async (invoice) => {
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
            subtotal: Number(invoice.subTotal),
            total: Number(invoice.balanceDue), // TODO: balanceDue로 필드명 변경
            discount: Number(invoice.volumeTierDiscount), // TODO: volumeTierDiscount로 필드명 변경
            clientOrganization: {
              id: invoice.organization.id,
              name: invoice.organization.name,
            },
            lineItems: await Promise.all(invoice.jobs.map(async (job) => await this.jobResponseMapper.toResponse(job))),
            payments: [],
            totalOfPayment: Number(invoice.paymentTotal),
            issuedAt: invoice.issuedAt,
          }
        }),
      ),
    })
  }
}
