import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { FindVendorPaymentPaginatedReturnType } from '../find-vendor-payment-paginated/find-vendor-payment.paginated.query-handler'
import { VendorPaymentNotFoundException } from '../../domain/vendor-payment.error'

export class FindVendorPaymentQuery {
  readonly vendorPaymentId: string
  constructor(props: FindVendorPaymentQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindVendorPaymentQuery)
export class FindVendorPaymentQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindVendorPaymentQuery): Promise<FindVendorPaymentPaginatedReturnType> {
    const result = await this.prismaService.vendorPayments.findUnique({
      where: { id: query.vendorPaymentId },
      include: {
        vendorInvoice: {
          include: {
            organization: true,
          },
        },
      },
    })
    if (!result) throw new VendorPaymentNotFoundException()
    return result
  }
}
