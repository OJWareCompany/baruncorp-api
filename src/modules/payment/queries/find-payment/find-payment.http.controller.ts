import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
import { PaymentResponseDto } from '../../dtos/payment.response.dto'
import { FindPaymentRequestDto } from './find-payment.request.dto'
import { FindPaymentQuery } from './find-payment.query-handler'
import { PaymentMethodEnum } from '../../domain/payment.type'

@Controller('payments')
export class FindPaymentHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':paymentId')
  async get(@Param() request: FindPaymentRequestDto): Promise<PaymentResponseDto> {
    const command = new FindPaymentQuery(request)

    const result: Payments = await this.queryBus.execute(command)

    return new PaymentResponseDto({
      id: result.id,
      invoiceId: result.invoiceId,
      amount: Number(result.amount),
      paymentMethod: PaymentMethodEnum[result.paymentMethod],
      paymentDate: result.paymentDate.toISOString(),
      notes: result.notes,
      canceledAt: result.canceledAt?.toISOString() || null,
    })
  }
}
