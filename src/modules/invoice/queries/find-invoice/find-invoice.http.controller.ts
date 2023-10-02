import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { InvoiceResponseDto } from '../../dtos/invoice.response.dto'
import { FindInvoiceRequestDto } from './find-invoice.request.dto'
import { FindInvoiceQuery } from './find-invoice.query-handler'

@Controller('invoices')
export class FindInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':invoiceId')
  async get(@Param() request: FindInvoiceRequestDto): Promise<InvoiceResponseDto> {
    const command = new FindInvoiceQuery(request)

    const result: InvoiceResponseDto = await this.queryBus.execute(command)

    return result
  }
}

/**
 * Mock Fields
 * totalJobPriceOverride
 * containsRevisionTask
 * state
 * taskSizeForRevision
 * pricingType
 *
 * Payment invoice 청구금 이상 지불 방지
 * invoice 청구금 모두 지불시 invoice 상태 paid로 변경
 *
 *
 */
