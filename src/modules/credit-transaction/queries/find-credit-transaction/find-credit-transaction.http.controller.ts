import { Controller, Get, Param } from '@nestjs/common'
import { CreditTransactions } from '@prisma/client'
import { QueryBus } from '@nestjs/cqrs'
import { CreditTransactionResponseDto } from '../../dtos/credit-transaction.response.dto'
import { CreditTransactionTypeEnum } from '../../domain/credit-transaction.type'
import { FindCreditTransactionRequestDto } from './find-credit-transaction.request.dto'
import { FindCreditTransactionQuery } from './find-credit-transaction.query-handler'

@Controller('credit-transactions')
export class FindCreditTransactionHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':creditTransactionId')
  async get(@Param() request: FindCreditTransactionRequestDto): Promise<CreditTransactionResponseDto> {
    const command = new FindCreditTransactionQuery(request)

    const result: CreditTransactions = await this.queryBus.execute(command)

    return new CreditTransactionResponseDto({
      id: result.id,
      createdByUserId: result.createdByUserId,
      clientOrganizationId: result.clientOrganizationId,
      createdBy: result.createdBy,
      amount: Number(result.amount),
      creditTransactionType: result.transactionType as CreditTransactionTypeEnum,
      relatedInvoiceId: result.relatedInvoiceId,
      transactionDate: result.transactionDate,
      canceledAt: result.canceledAt,
    })
  }
}
