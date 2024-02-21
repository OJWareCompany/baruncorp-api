import { Controller, Get, Param } from '@nestjs/common'
import { CreditTransactions } from '@prisma/client'
import { QueryBus } from '@nestjs/cqrs'
import { VendorCreditTransactionResponseDto } from '../../dtos/vendor-credit-transaction.response.dto'
import { VendorCreditTransactionTypeEnum } from '../../domain/vendor-credit-transaction.type'
import { FindVendorCreditTransactionRequestDto } from './find-vendor-credit-transaction.request.dto'
import { FindVendorCreditTransactionQuery } from './find-vendor-credit-transaction.query-handler'

@Controller('vendor-credit-transactions')
export class FindVendorCreditTransactionHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':vendorCreditTransactionId')
  async get(@Param() request: FindVendorCreditTransactionRequestDto): Promise<VendorCreditTransactionResponseDto> {
    const command = new FindVendorCreditTransactionQuery(request)

    const result: CreditTransactions = await this.queryBus.execute(command)

    return new VendorCreditTransactionResponseDto({
      id: result.id,
      createdByUserId: result.createdByUserId,
      vendorOrganizationId: result.clientOrganizationId,
      createdBy: result.createdBy,
      amount: Number(result.amount),
      creditTransactionType: result.transactionType as VendorCreditTransactionTypeEnum,
      relatedVendorInvoiceId: result.relatedInvoiceId,
      transactionDate: result.transactionDate,
      canceledAt: result.canceledAt,
    })
  }
}
