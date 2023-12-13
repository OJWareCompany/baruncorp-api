import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindVendorToInvoicePaginatedQuery } from './find-vendor-to-invoice.paginated.query-handler'
import { VendorToInvoiceResponseDto } from '../../dtos/vendor-to-invoice.response.dto'

@Controller('vendor-to-invoices')
export class FindVendorToInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(): Promise<VendorToInvoiceResponseDto> {
    const command = new FindVendorToInvoicePaginatedQuery({})
    return await this.queryBus.execute(command)
  }
}
