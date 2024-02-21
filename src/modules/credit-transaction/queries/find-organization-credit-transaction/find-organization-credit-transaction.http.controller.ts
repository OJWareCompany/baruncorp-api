import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindOrganizationCreditTransactionRequestDto as FindOrganizationCreditTransactionRequestDto } from './find-organization-credit-transaction.request.dto'
import { FindOrganizationCreditTransactionQuery as FindOrganizationCreditTransactionQuery } from './find-organization-credit-transaction.query-handler'
import { CreditOrganizationTransactionResponseDto } from '../../dtos/credit-transaction.response.dto copy'

@Controller('credit-transactions')
export class FindOrganizationCreditTransactionHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('organizations/:organizationId')
  async get(
    @Param() request: FindOrganizationCreditTransactionRequestDto,
  ): Promise<CreditOrganizationTransactionResponseDto> {
    const command = new FindOrganizationCreditTransactionQuery(request)
    const result: number = await this.queryBus.execute(command)
    return {
      clientOrganizationId: request.organizationId,
      creditAmount: result,
    }
  }
}
