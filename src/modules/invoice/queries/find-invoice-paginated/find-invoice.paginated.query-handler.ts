import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Invoices } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'

export class FindInvoicePaginatedQuery extends PaginatedQueryBase {
  readonly invoiceId: string
  constructor(props: PaginatedParams<FindInvoicePaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindInvoicePaginatedQuery)
export class FindInvoicePaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindInvoicePaginatedQuery): Promise<Paginated<Invoices>> {
    const result = await this.prismaService.invoices.findMany({
      where: { id: query.invoiceId },
      skip: query.offset,
      take: query.limit,
    })
    if (!result) throw new NotFoundException()
    const totalCount = await this.prismaService.invoices.count({
      where: { id: query.invoiceId },
    })
    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
