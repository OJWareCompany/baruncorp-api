import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VendorInvoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindVendorInvoiceQuery {
  readonly vendorInvoiceId: string
  constructor(props: FindVendorInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorInvoiceQuery)
export class FindVendorInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindVendorInvoiceQuery): Promise<VendorInvoices> {
    const result = await this.prismaService.vendorInvoices.findUnique({ where: { id: query.vendorInvoiceId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
