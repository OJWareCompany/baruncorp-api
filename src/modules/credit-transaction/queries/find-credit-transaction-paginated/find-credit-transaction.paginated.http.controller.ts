import { Controller, Get, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { CreditTransactions } from '@prisma/client'
import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { CreditTransactionPaginatedResponseDto } from '../../dtos/credit-transaction.paginated.response.dto'
import { CreditTransactionTypeEnum } from '../../domain/credit-transaction.type'
import { FindCreditTransactionPaginatedRequestDto } from './find-credit-transaction.paginated.request.dto'
import { FindCreditTransactionPaginatedQuery } from './find-credit-transaction.paginated.query-handler'

@Controller('credit-transactions')
export class FindCreditTransactionPaginatedHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  async get(
    @Query() request: FindCreditTransactionPaginatedRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<CreditTransactionPaginatedResponseDto> {
    const command = new FindCreditTransactionPaginatedQuery({
      ...request,
      ...queryParams,
    })

    const result: Paginated<CreditTransactions> = await this.queryBus.execute(command)

    return new CreditTransactionPaginatedResponseDto({
      ...queryParams,
      ...result,
      items: result.items.map((item) => ({
        id: item.id,
        createdByUserId: item.createdByUserId,
        clientOrganizationId: item.clientOrganizationId,
        createdBy: item.createdBy,
        amount: Number(item.amount),
        creditTransactionType: item.transactionType as CreditTransactionTypeEnum,
        relatedInvoiceId: item.relatedInvoiceId,
        transactionDate: item.transactionDate,
        canceledAt: item.canceledAt,
      })),
    })
  }
}
