import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { VendorPaymentPaginatedResponseDto } from '../../dtos/vendor-payment.paginated.response.dto'
import { FindVendorPaymentPaginatedRequestDto } from './find-vendor-payment.paginated.request.dto'
import {
  FindVendorPaymentPaginatedQuery,
  FindVendorPaymentPaginatedReturnType,
} from './find-vendor-payment.paginated.query-handler'
import { PaymentMethodEnum } from '../../domain/vendor-payment.type'

@Controller('vendor-payments')
export class FindVendorPaymentPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindVendorPaymentPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<VendorPaymentPaginatedResponseDto> {
    const command = new FindVendorPaymentPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<FindVendorPaymentPaginatedReturnType> = await this.queryBus.execute(command)

    return new VendorPaymentPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        vendorInvoiceId: item.vendorInvoiceId,
        amount: Number(item.amount),
        paymentMethod: PaymentMethodEnum[item.paymentMethod],
        paymentDate: item.paymentDate.toISOString(),
        notes: item.notes,
        canceledAt: item.canceledAt?.toISOString() || null,
        organizationId: item.vendorInvoice.organization.id,
        organizationName: item.vendorInvoice.organization.name,
      })),
    })
  }
}
