import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindOrganizationCreditTransactionRequestDto } from './find-vendor-organization-credit-transaction.request.dto'
import { FindVendorOrganizationCreditTransactionQuery } from './find-vendor-organization-credit-transaction.query-handler'
import { VendorCreditOrganizationTransactionResponseDto } from '../../dtos/vendor-credit-transaction.response.dto copy'

@Controller('vendor-credit-transactions')
export class FindVendorOrganizationCreditTransactionHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('organizations/:vendorOrganizationId')
  async get(
    @Param() request: FindOrganizationCreditTransactionRequestDto,
  ): Promise<VendorCreditOrganizationTransactionResponseDto> {
    const command = new FindVendorOrganizationCreditTransactionQuery(request)
    const result: number = await this.queryBus.execute(command)
    return {
      vendorOrganizationId: request.vendorOrganizationId,
      creditAmount: result,
    }
  }
}
