/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorInvoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'
import { VENDOR_INVOICE_REPOSITORY } from '../../vendor-invoice.di-token'
import { VendorInvoiceRepositoryPort } from '../../database/vendor-invoice.repository.port'
import { VendorInvoiceMapper } from '../../vendor-invoice.mapper'
import { VendorInvoiceNotFoundException } from '../../domain/vendor-invoice.error'

export class FindVendorInvoiceQuery {
  readonly vendorInvoiceId: string
  constructor(props: FindVendorInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoiceQuery)
export class FindVendorInvoiceQueryHandler implements IQueryHandler {
  constructor(
    private readonly prismaService: PrismaService,
    // @ts-ignore
    @Inject(VENDOR_INVOICE_REPOSITORY) private readonly vendorInvoiceRepo: VendorInvoiceRepositoryPort,
    private readonly mapper: VendorInvoiceMapper,
  ) {}

  async execute(query: FindVendorInvoiceQuery): Promise<VendorInvoiceResponseDto> {
    const result = await this.vendorInvoiceRepo.findOne(query.vendorInvoiceId)
    if (!result) throw new VendorInvoiceNotFoundException()
    return this.mapper.toResponse(result)
  }
}
