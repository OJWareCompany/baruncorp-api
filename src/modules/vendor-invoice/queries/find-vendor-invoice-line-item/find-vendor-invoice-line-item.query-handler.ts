/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorInvoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { VendorInvoiceLineItemResponse } from '../../dtos/vendor-invoice-line-item.response.dto'
import { AssignedTaskMapper } from '../../../assigned-task/assigned-task.mapper'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'

export class FindVendorInvoiceLineItemQuery extends PaginatedQueryBase {
  readonly vendorInvoiceId: string
  constructor(props: PaginatedParams<FindVendorInvoiceLineItemQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoiceLineItemQuery)
export class FindVendorInvoiceLineItemQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: AssignedTaskMapper) {}

  async execute(query: FindVendorInvoiceLineItemQuery): Promise<Paginated<VendorInvoiceLineItemResponse>> {
    const result = await this.prismaService.assignedTasks.findMany({
      take: query.limit,
      skip: query.offset,
      where: {
        vendorInvoiceId: query.vendorInvoiceId,
      },
      orderBy: {
        doneAt: 'desc',
      },
    })
    const totalCount = await this.prismaService.assignedTasks.count({
      where: {
        vendorInvoiceId: query.vendorInvoiceId,
      },
    })

    return new Paginated<VendorInvoiceLineItemResponse>({
      items: result.map(this.mapper.toDomain).map(this.mapper.toResponseForVendorLineItem),
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
    })
  }
}
