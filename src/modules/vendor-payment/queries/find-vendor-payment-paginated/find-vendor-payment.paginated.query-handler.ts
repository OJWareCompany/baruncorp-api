import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Organizations, VendorInvoices, VendorPayments } from '@prisma/client'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { PrismaService } from '../../../database/prisma.service'
import { VendorPaymentNotFoundException } from '../../domain/vendor-payment.error'

export class FindVendorPaymentPaginatedQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<FindVendorPaymentPaginatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

export type FindVendorPaymentPaginatedReturnType = VendorPayments & {
  vendorInvoice: VendorInvoices & { organization: Organizations }
}
@QueryHandler(FindVendorPaymentPaginatedQuery)
export class FindPaymentPaginatedQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: FindVendorPaymentPaginatedQuery): Promise<Paginated<FindVendorPaymentPaginatedReturnType>> {
    // TODO: vendorInvoice가 삭제되었는데 페이먼트 데이터가 남아있는 경우에 대한 예외처리 필요
    const result = await this.prismaService.vendorPayments.findMany({
      include: {
        vendorInvoice: {
          include: {
            organization: true,
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
      skip: query.offset,
      take: query.limit,
    })

    if (!result) throw new VendorPaymentNotFoundException()
    const totalCount = await this.prismaService.vendorPayments.count()

    return new Paginated({
      page: query.page,
      pageSize: query.limit,
      totalCount: totalCount,
      items: result,
    })
  }
}
