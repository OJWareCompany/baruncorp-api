/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { AssignedTaskRepositoryPort } from '../../../assigned-task/database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../../assigned-task/assigned-task.di-token'
import { getMonth } from 'date-fns'
import { LineItem } from '../../../invoice/dtos/invoice.response.dto'

export class FindVendorToInvoicePaginatedQuery {
  // readonly vendorInvoiceId: string
  constructor(props: FindVendorToInvoicePaginatedQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorToInvoicePaginatedQuery)
export class FindVendorToInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY)
    private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(query: FindVendorToInvoicePaginatedQuery): Promise<any> {
    // const result = await this.assignTaskRepo.findToVendorInvoice(query.)
    // skip: query.offset,
    // take: query.limit,
    // const totalCount = await this.prismaService.vendorInvoices.count()
    // const a = await this.assignTaskRepo.find()

    // const result = await this.prismaService.assignedTasks.groupBy({
    //   by: ['startedAt'],
    // })
    // console.log(2)
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

    console.log(vendors)
    console.log(vendorsLineItems)
    // console.log(getMonth(new Date()))
    return {
      // ...query,
      // page: query.page,
      // pageSize: query.limit,
      // totalPage: 0,
      // totalCount: vendors.length,
      vendorsToInvoice: vendors.map((lineitem) => {
        return {
          organizationName: lineitem.organization_name,
          organizationId: lineitem.organization_id,
          dates: vendorsLineItems
            .filter((item) => item.organization_id === lineitem.organization_id)
            .map((item) => item.started_at),
          // startedAt:
          //   lienitems.started_at.toISOString().split('-')[0] + '-' + lienitems.started_at.toISOString().split('-')[1],
        }
      }),
    }
  }
}
// vendorsLineItems.map((lienitems) => {
//   return {
//     organizationName: lienitems.organization_name,
//     organizationId: lienitems.organization_id,
//     startedAt:
//       lienitems.started_at.toISOString().split('-')[0] + '-' + lienitems.started_at.toISOString().split('-')[1],
//   }
// }),
