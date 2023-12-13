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
    GROUP BY organization_id
    ORDER BY started_at DESC;
    `

    const vendorsLineItems: any[] = await this.prismaService.$queryRaw`
    SELECT * from assigned_tasks at
    WHERE at.status = 'Completed'
    AND at.is_vendor = 1
    AND at.vendor_invoice_id IS NULL
    AND at.cost IS NOT NULL
    GROUP BY organization_id, DATE_FORMAT(at.started_at,'%Y-%m')
    ORDER BY started_at DESC;
    `

    return {
      vendorsToInvoice: vendors.map((lineitem) => {
        return {
          organizationName: lineitem.organization_name,
          organizationId: lineitem.organization_id,
          dates: vendorsLineItems
            .filter((item) => item.organization_id === lineitem.organization_id)
            .map((item) => item.started_at),
        }
      }),
    }
  }
}
