import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindPaymentPaginatedReturnType } from '../find-payment-paginated/find-payment.paginated.query-handler'
import { PaymentResponseDto } from '../../dtos/payment.response.dto'
import { PaymentMethodEnum } from '../../domain/payment.type'
import { FindPaymentRequestDto } from './find-payment.request.dto'
import { FindPaymentQuery } from './find-payment.query-handler'

@Controller('payments')
export class FindPaymentHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':paymentId')
  async get(@Param() request: FindPaymentRequestDto): Promise<PaymentResponseDto> {
    const command = new FindPaymentQuery(request)

    const result: FindPaymentPaginatedReturnType = await this.queryBus.execute(command)

    return new PaymentResponseDto({
      id: result.id,
      invoiceId: result.invoiceId,
      amount: Number(result.amount),
      paymentMethod: result.paymentMethod as PaymentMethodEnum,
      paymentDate: result.paymentDate.toISOString(),
      notes: result.notes,
      canceledAt: result.canceledAt?.toISOString() || null,
      organizationId: result.invoice.organization.id,
      organizationName: result.invoice.organization.name,
    })
  }
}
