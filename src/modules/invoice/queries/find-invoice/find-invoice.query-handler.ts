import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'

export class FindInvoiceQuery {
  readonly invoiceId: string
  constructor(props: FindInvoiceQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindInvoiceQuery)
export class FindInvoiceQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindInvoiceQuery): Promise<Invoices> {
    const result = await this.prismaService.invoices.findUnique({ where: { id: query.invoiceId } })
    if (!result) throw new NotFoundException()
    return result
  }
}
