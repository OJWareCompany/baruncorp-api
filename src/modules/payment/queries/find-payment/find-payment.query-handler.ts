import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { FindPaymentPaginatedReturnType } from '../find-payment-paginated/find-payment.paginated.query-handler'
import { PaymentNotFoundException } from '../../domain/payment.error'

export class FindPaymentQuery {
  readonly paymentId: string
  constructor(props: FindPaymentQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindPaymentQuery)
export class FindPaymentQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindPaymentQuery): Promise<FindPaymentPaginatedReturnType> {
    const result = await this.prismaService.payments.findUnique({
      where: { id: query.paymentId },
      include: {
        invoice: {
          include: {
            organization: true,
          },
        },
      },
    })
    if (!result) throw new PaymentNotFoundException()
    return result
  }
}
