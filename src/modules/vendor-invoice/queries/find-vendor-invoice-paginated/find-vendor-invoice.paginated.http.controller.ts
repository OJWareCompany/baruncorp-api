import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { VendorInvoicePaginatedResponseDto } from '../../dtos/vendor-invoice.paginated.response.dto'
import { FindVendorInvoicePaginatedRequestDto } from './find-vendor-invoice.paginated.request.dto'
import { FindVendorInvoicePaginatedQuery } from './find-vendor-invoice.paginated.query-handler'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'

@Controller('vendor-invoices')
export class FindVendorInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindVendorInvoicePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<VendorInvoicePaginatedResponseDto> {
    const command = new FindVendorInvoicePaginatedQuery({
      organizationId: request.organizationId,
      organizationName: request.organizationName,
    })

    const result: Paginated<VendorInvoiceResponseDto> = await this.queryBus.execute(command)

    return new VendorInvoicePaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items,
    })
  }
}
