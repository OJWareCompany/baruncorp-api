/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { JobResponseMapper } from '../../../ordered-job/job.response.mapper'
import { InvoicePaginatedResponseDto } from '../../dtos/invoice.paginated.response.dto'
import { FindInvoiceOverduePaginatedRequestDto } from './find-overdue-invoices.paginated.request.dto'
import {
  FindOverdueInvoicePaginatedQuery,
  FindOverdueInvoicePaginatedReturnType,
} from './find-overdue-invoices.paginated.query-handler'

@Controller('overdue-invoices')
export class FindOverdueInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus, private readonly jobResponseMapper: JobResponseMapper) {}

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
            balanceDue: Number(invoice.balanceDue), // TODO: balanceDue로 필드명 변경
            total: Number(invoice.total), // TODO: balanceDue로 필드명 변경
            volumeTierDiscount: Number(invoice.volumeTierDiscount),
            amountPaid: 0,
            appliedCredit: 0,
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
            issuedAt: invoice.issuedAt,
            currentCc: invoice.currentCc ? invoice.currentCc.split(',') : [],
            issueHistory: [],
          }
        }),
      ),
    })
  }
}
