import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Invoices } from '@prisma/client'
import { InvoiceResponseDto } from '../../dtos/invoice.response.dto'
import { FindInvoiceRequestDto } from './find-invoice.request.dto'
import { FindInvoiceQuery } from './find-invoice.query-handler'

@Controller('invoices')
export class FindInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':invoiceId')
  async get(@Param() request: FindInvoiceRequestDto): Promise<InvoiceResponseDto> {
    const command = new FindInvoiceQuery(request)

    const result: any = await this.queryBus.execute(command)

    return new InvoiceResponseDto({
      ...result,
    })
  }
}
