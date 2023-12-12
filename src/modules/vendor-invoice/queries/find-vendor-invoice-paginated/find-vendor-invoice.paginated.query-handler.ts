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
  readonly vendorInvoiceId: string
  constructor(props: PaginatedParams<FindVendorInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoicePaginatedQuery)
export class FindVendorInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(
    private readonly prismaService: PrismaService,
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    private readonly mapper: VendorInvoiceMapper,
  ) {}

  async execute(query: FindVendorInvoicePaginatedQuery): Promise<Paginated<VendorInvoiceResponseDto>> {
    const result = await this.vendorInvoiceRepo.find()
    // skip: query.offset,
    // take: query.limit,
    // const totalCount = await this.prismaService.vendorInvoices.count()

    return {
      ...result,
      items: result.items.map(this.mapper.toResponse),
    }
  }
}
