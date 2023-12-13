import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { VendorPaymentResponseDto } from '../../dtos/vendor-payment.response.dto'
import { FindVendorPaymentRequestDto } from './find-vendor-payment.request.dto'
import { FindVendorPaymentQuery } from './find-vendor-payment.query-handler'
import { PaymentMethodEnum } from '../../domain/vendor-payment.type'
import { FindVendorPaymentPaginatedReturnType } from '../find-vendor-payment-paginated/find-vendor-payment.paginated.query-handler'

@Controller('vendor-payments')
export class FindVendorPaymentHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':vendorPaymentId')
  async get(@Param() request: FindVendorPaymentRequestDto): Promise<VendorPaymentResponseDto> {
    const command = new FindVendorPaymentQuery(request)

    const result: FindVendorPaymentPaginatedReturnType = await this.queryBus.execute(command)

    return new VendorPaymentResponseDto({
      id: result.id,
      vendorInvoiceId: result.vendorInvoiceId,
      amount: Number(result.amount),
      paymentMethod: PaymentMethodEnum[result.paymentMethod],
      paymentDate: result.paymentDate.toISOString(),
      notes: result.notes,
      canceledAt: result.canceledAt?.toISOString() || null,
      organizationId: result.vendorInvoice.organization.id,
      organizationName: result.vendorInvoice.organization.name,
    })
  }
}
