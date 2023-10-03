import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { InvoicePaginatedResponseDto } from '../../dtos/invoice.paginated.response.dto'
import { FindInvoicePaginatedQuery, FindInvoidPaginatedReturnType } from './find-invoice.paginated.query-handler'
import {
  MountingType,
  MountingTypeEnum,
  ProjectPropertyType,
  ProjectPropertyTypeEnum,
} from '../../../project/domain/project.type'

@Controller('invoices')
export class FindInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(@Query() queryParams: PaginatedQueryRequestDto): Promise<InvoicePaginatedResponseDto> {
    const command = new FindInvoicePaginatedQuery({
      ...queryParams,
    })
    const result: FindInvoidPaginatedReturnType = await this.queryBus.execute(command)

    return new InvoicePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((invoice) => ({
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
        subtotal: invoice.jobs.reduce((pre, cur) => {
          return pre + cur.subtotal
        }, 0),
        discount: invoice.jobs.reduce((pre, cur) => {
          return pre + cur.discountAmount
        }, 0),
        total: invoice.jobs.reduce((pre, cur) => {
          return pre + cur.total
        }, 0),
        clientOrganization: {
          id: invoice.organization.id,
          name: invoice.organization.name,
        },
        lineItems: invoice.jobs.map((job) => ({
          jobRequestNumber: job.getProps().jobRequestNumber,
          description: job.getProps().jobName,
          dateSentToClient: job.getProps().updatedAt,
          mountingType:
            (job.getProps().mountingType as MountingType) === 'Ground Mount'
              ? MountingTypeEnum.Ground_Mount
              : (job.getProps().mountingType as MountingType) === 'Roof Mount'
              ? MountingTypeEnum.Roof_Mount
              : MountingTypeEnum.RG_Mount,
          totalJobPriceOverride: null, //TODO: job필드 추가?
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
        })),
        payments: [],
        totalOfPayment: 0,
      })),
    })
  }
}
