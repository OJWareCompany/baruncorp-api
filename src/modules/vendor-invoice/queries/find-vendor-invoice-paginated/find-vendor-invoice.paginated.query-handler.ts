/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'
import { VendorInvoiceMapper } from '../../vendor-invoice.mapper'
import { Prisma } from '@prisma/client'

export class FindVendorInvoicePaginatedQuery extends PaginatedQueryBase {
  readonly organizationName?: string | null
  readonly organizationId?: string | null
  constructor(props: PaginatedParams<FindVendorInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoicePaginatedQuery)
export class FindVendorInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly mapper: VendorInvoiceMapper) {}

  async execute(query: FindVendorInvoicePaginatedQuery): Promise<Paginated<VendorInvoiceResponseDto>> {
    const condition: Prisma.VendorInvoicesWhereInput = {
      ...(query.organizationName && { organizationName: { contains: query.organizationName } }),
      ...(query.organizationId && { organizationId: query.organizationId }),
      // ...(query.status && { status: query.status }),
    }

    const records = await this.prismaService.vendorInvoices.findMany({
      take: query.limit,
      skip: query.offset,
      where: condition,
    })

    const totalCount = await this.prismaService.vendorInvoices.count({ where: condition })

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount,
      items: records.map(this.mapper.toDomain).map(this.mapper.toResponse),
    })
  }
}
