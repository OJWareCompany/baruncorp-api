import { Controller, Get, Param, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindVendorInvoiceRequestDto } from './find-vendor-invoice-line-item.request.dto'
import { FindVendorInvoiceLineItemQuery } from './find-vendor-invoice-line-item.query-handler'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { VendorInvoiceLineItemPaginatedResponseDto } from '../../dtos/vendor-invoice-line-item.paginated.response.dto'
import { VendorInvoiceLineItemResponse } from '../../dtos/vendor-invoice-line-item.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'

@Controller('vendor-invoices')
export class FindVendorInvoiceLineItemHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':vendorInvoiceId/line-items')
  async get(
    @Param() request: FindVendorInvoiceRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<VendorInvoiceLineItemPaginatedResponseDto> {
    const command = new FindVendorInvoiceLineItemQuery({
      ...queryParams,
      ...request,
    })
    const result: Paginated<VendorInvoiceLineItemResponse> = await this.queryBus.execute(command)
    return new VendorInvoiceLineItemPaginatedResponseDto({
      ...result,
      items: result.items,
    })
  }
}
