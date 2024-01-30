/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Query } from '@nestjs/common'
import { FindVendorToInvoicePaginatedRequestDto } from './find-vendor-to-invoice-line-items.paginated.request.dto'
import { VendorInvoiceLineItemPaginatedResponseDto } from '../../dtos/vendor-invoice-line-item.paginated.response.dto'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { QueryBus } from '@nestjs/cqrs'
import { FindVendorToInvoiceLineItemsQuery } from './find-vendor-to-invoice-line-items.paginated.query-handler'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { VendorInvoiceLineItemResponse } from '../../dtos/vendor-invoice-line-item.response.dto'

@Controller('vendor-to-invoice-line-items')
export class FindVendorToInvoiceLineItemsPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindVendorToInvoicePaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<VendorInvoiceLineItemPaginatedResponseDto> {
    const query = new FindVendorToInvoiceLineItemsQuery({
      ...request,
      clientOrganizationId: request.clientOrganizationId,
      serviceMonth: request.serviceMonth,
      page: queryParams.page,
      limit: queryParams.limit,
    })

    const result: Paginated<VendorInvoiceLineItemResponse> = await this.queryBus.execute(query)

    return new VendorInvoiceLineItemPaginatedResponseDto({
      ...result,
      items: result.items,
    })
  }
}
