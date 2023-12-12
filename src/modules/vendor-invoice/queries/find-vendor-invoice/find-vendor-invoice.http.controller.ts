import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { VendorInvoiceResponseDto } from '../../dtos/vendor-invoice.response.dto'
import { FindVendorInvoiceRequestDto } from './find-vendor-invoice.request.dto'
import { FindVendorInvoiceQuery } from './find-vendor-invoice.query-handler'

@Controller('vendor-invoices')
export class FindVendorInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':vendorInvoiceId')
  async get(@Param() request: FindVendorInvoiceRequestDto): Promise<VendorInvoiceResponseDto> {
    const command = new FindVendorInvoiceQuery(request)

    const result: VendorInvoiceResponseDto = await this.queryBus.execute(command)

    return result
  }
}
