import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { VendorCreditTransactions } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { VendorCreditTransactionPaginatedResponseDto } from '../../dtos/vendor-credit-transaction.paginated.response.dto'
import { VendorCreditTransactionTypeEnum } from '../../domain/vendor-credit-transaction.type'
import { FindVendorCreditTransactionPaginatedRequestDto } from './find-vendor-credit-transaction.paginated.request.dto'
import { FindVendorCreditTransactionPaginatedQuery } from './find-vendor-credit-transaction.paginated.query-handler'

@Controller('vendor-credit-transactions')
export class FindVendorCreditTransactionPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindVendorCreditTransactionPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<VendorCreditTransactionPaginatedResponseDto> {
    const command = new FindVendorCreditTransactionPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<VendorCreditTransactions> = await this.queryBus.execute(command)

    return new VendorCreditTransactionPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        createdByUserId: item.createdByUserId,
        vendorOrganizationId: item.vendorOrganizationId,
        createdBy: item.createdBy,
        amount: Number(item.amount),
        creditTransactionType: item.transactionType as VendorCreditTransactionTypeEnum,
        relatedVendorInvoiceId: item.relatedVendorInvoiceId,
        transactionDate: item.transactionDate,
        canceledAt: item.canceledAt,
      })),
    })
  }
}
