import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { InvoiceResponseDto } from '../../dtos/invoice.response.dto'
import { FindInvoiceRequestDto } from './find-invoice.request.dto'
import { FindInvoiceQuery, FindInvoidReturnType } from './find-invoice.query-handler'
import { MountingType, ProjectPropertyType, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { MountingTypeEnum } from '../../../project/domain/project.type'

@Controller('invoices')
export class FindInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':invoiceId')
  async get(@Param() request: FindInvoiceRequestDto): Promise<InvoiceResponseDto> {
    const command = new FindInvoiceQuery(request)

    const result: FindInvoidReturnType = await this.queryBus.execute(command)

    return new InvoiceResponseDto({
      id: result.id,
      status: result.status,
      invoiceDate: result.invoiceDate.toISOString(),
      terms: result.terms,
      dueDate: result.dueDate!.toISOString(),
      notesToClient: result.notesToClient,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
      servicePeriodDate: result.serviceMonth.toISOString(),
      subtotal: result.jobs.reduce((pre, cur) => {
        return pre + cur.subtotal
      }, 0),
      discount: result.jobs.reduce((pre, cur) => {
        return pre + cur.discountAmount
      }, 0),
      total: result.jobs.reduce((pre, cur) => {
        return pre + cur.total
      }, 0),
      clientOrganization: {
        id: result.organization.id,
        name: result.organization.name,
      },
      lineItems: result.jobs.map((job) => ({
        jobRequestNumber: job.getProps().jobRequestNumber,
        description: job.getProps().jobName,
        dateSentToClient: job.getProps().updatedAt,
        mountingType:
          (job.getProps().mountingType as MountingType) === 'Ground Mount'
            ? MountingTypeEnum.Ground_Mount
            : (job.getProps().mountingType as MountingType) === 'Roof Mount'
            ? MountingTypeEnum.Roof_Mount
            : MountingTypeEnum.RG_Mount,
        totalJobPriceOverride: null, // TODO: job필드 추가?
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
    })
  }
}

/**
 * Mock Fields
 * totalJobPriceOverride
 * containsRevisionTask
 * state
 * taskSizeForRevision
 * pricingType
 *
 * Payment invoice 청구금 이상 지불 방지
 * invoice 청구금 모두 지불시 invoice 상태 paid로 변경
 *
 *
 */
