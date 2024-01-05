import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindVendorToInvoicePaginatedQuery } from './find-vendor-to-invoice.paginated.query-handler'
import { VendorToInvoiceResponseDto } from '../../dtos/vendor-to-invoice.response.dto'
import { ApiOperation } from '@nestjs/swagger'

@Controller('vendor-to-invoices')
export class FindVendorToInvoicePaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiOperation({ description: '바른코프에서 외주 비용을 지불해야할 외주 회사 리스트 조회' })
  async get(): Promise<VendorToInvoiceResponseDto> {
    const command = new FindVendorToInvoicePaginatedQuery({})
    return await this.queryBus.execute(command)
  }
}
