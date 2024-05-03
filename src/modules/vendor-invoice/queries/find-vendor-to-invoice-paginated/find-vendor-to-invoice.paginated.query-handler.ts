/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { VendorToInvoiceResponseDto } from '../../dtos/vendor-to-invoice.response.dto'

export class FindVendorToInvoicePaginatedQuery {
  // readonly vendorInvoiceId: string
  constructor(props: FindVendorToInvoicePaginatedQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorToInvoicePaginatedQuery)
export class FindVendorToInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(): Promise<VendorToInvoiceResponseDto> {
    const vendors: any[] = await this.prismaService.$queryRaw`
    SELECT * from assigned_tasks at
    WHERE at.status = 'Completed'
    AND at.is_vendor = 1
    AND at.vendor_invoice_id IS NULL
    AND at.cost IS NOT NULL
    GROUP BY assignee_organization_id
    ORDER BY done_at DESC;
    `

    const vendorsLineItems: any[] = await this.prismaService.$queryRaw`
    SELECT assignee_organization_name, assignee_organization_id, MAX(done_at) AS done_at
    FROM assigned_tasks at
    WHERE at.status = 'Completed'
    AND at.is_vendor = 1
    AND at.vendor_invoice_id IS NULL
    AND at.cost IS NOT NULL
    GROUP BY assignee_organization_id, DATE_FORMAT(at.done_at,'%Y-%m')
    ORDER BY done_at DESC;
    `

    return {
      vendorsToInvoice: vendors.map((assignedTasks) => {
        return {
          organizationName: assignedTasks.assignee_organization_name,
          organizationId: assignedTasks.assignee_organization_id,
          dates: vendorsLineItems
            .filter((item) => item.assignee_organization_id === assignedTasks.assignee_organization_id)
            .map((item) => item.done_at),
        }
      }),
    }
  }
}
