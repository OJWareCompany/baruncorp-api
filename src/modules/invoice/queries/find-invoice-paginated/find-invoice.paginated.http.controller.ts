import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Invoices } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { InvoicePaginatedResponseDto } from '../../dtos/invoice.paginated.response.dto'
import { FindInvoicePaginatedRequestDto } from './find-invoice.paginated.request.dto'
import { FindInvoicePaginatedQuery } from './find-invoice.paginated.query-handler'

@Controller('invoices')
export class FindInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindInvoicePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<InvoicePaginatedResponseDto> {
    const command = new FindInvoicePaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<Invoices> = await this.queryBus.execute(command)

    return new InvoicePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: [],
      // items: result.items.map((item) => ({
      //   id: item.id,
      // })),
    })
  }
}
