import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { VendorInvoicePaginatedResponseDto } from '../../dtos/vendor-invoice.paginated.response.dto'
import { FindVendorToInvoicePaginatedQuery } from './find-vendor-to-invoice.paginated.query-handler'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'
import { VendorToInvoiceResponseDto } from '../../dtos/vendor-to-invoice.response.dto'

@Controller('vendor-to-invoices')
export class FindVendorToInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(): Promise<VendorToInvoiceResponseDto> {
    const command = new FindVendorToInvoicePaginatedQuery({
      // ...request,
      // ...queryParams,
    })

    const result: VendorToInvoiceResponseDto = await this.queryBus.execute(command)

    return result
  }
}
