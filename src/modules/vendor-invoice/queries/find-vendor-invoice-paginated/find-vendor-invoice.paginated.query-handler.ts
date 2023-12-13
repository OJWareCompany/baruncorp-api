/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorInvoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VendorInvoiceMapper } from '../../vendor-invoice.mapper'

export class FindVendorInvoicePaginatedQuery extends PaginatedQueryBase {
  readonly organizationName?: string | null
  constructor(props: PaginatedParams<FindVendorInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoicePaginatedQuery)
export class FindVendorInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: VendorInvoiceMapper) {}

  async execute(query: FindVendorInvoicePaginatedQuery): Promise<Paginated<VendorInvoiceResponseDto>> {
    const records = await this.prismaService.vendorInvoices.findMany({
      take: query.limit,
      skip: query.offset,
      where: {
        ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
      },
    })
    const totalCount = await this.prismaService.vendorInvoices.count({
      where: {
        ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
      },
    })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount,
      items: records.map(this.mapper.toDomain).map(this.mapper.toResponse),
    })
  }
}
