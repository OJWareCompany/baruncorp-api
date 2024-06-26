import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaymentPaginatedResponseDto } from '../../dtos/payment.paginated.response.dto'
import { PaymentMethodEnum } from '../../domain/payment.type'
import { FindPaymentPaginatedQuery, FindPaymentPaginatedReturnType } from './find-payment.paginated.query-handler'
import { FindPaymentPaginatedRequestDto } from './find-payment.paginated.request.dto'

@Controller('payments')
export class FindPaymentPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindPaymentPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<PaymentPaginatedResponseDto> {
    const command = new FindPaymentPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<FindPaymentPaginatedReturnType> = await this.queryBus.execute(command)

    return new PaymentPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        invoiceId: item.invoiceId,
        amount: Number(item.amount),
        paymentMethod: item.paymentMethod as PaymentMethodEnum,
        paymentDate: item.paymentDate.toISOString(),
        notes: item.notes,
        canceledAt: item.canceledAt?.toISOString() || null,
        organizationId: item.invoice.organization.id,
        organizationName: item.invoice.organization.name,
      })),
    })
  }
}
