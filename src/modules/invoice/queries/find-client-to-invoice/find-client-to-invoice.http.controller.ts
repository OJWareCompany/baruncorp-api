import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ClientToInvoiceResponseDto } from '../../dtos/client-to-invoice.response.dto'
import { FindClientToInvoiceQuery } from './find-client-to-invoice.query-handler'

@Controller('invoices-clients')
export class FindClientToInvoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async get(): Promise<ClientToInvoiceResponseDto> {
    const command = new FindClientToInvoiceQuery({})

    const result: ClientToInvoiceResponseDto = await this.queryBus.execute(command)

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
