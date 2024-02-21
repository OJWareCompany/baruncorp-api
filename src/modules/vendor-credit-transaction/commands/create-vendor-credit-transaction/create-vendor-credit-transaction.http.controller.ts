import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreateVendorCreditTransactionRequestDto } from './create-vendor-credit-transaction.request.dto'
import { CreateVendorCreditTransactionCommand } from './create-vendor-credit-transaction.command'

@Controller('vendor-credit-transactions')
export class CreateVendorCreditTransactionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreateVendorCreditTransactionRequestDto): Promise<IdResponse> {
    const command = new CreateVendorCreditTransactionCommand({
      createdByUserId: user.id,
      amount: request.amount,
      creditTransactionType: request.creditTransactionType,
      relatedVendorInvoiceId: request.relatedInvoiceId,
      vendorOrganizationId: request.clientOrganizationId,
      note: request.note,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
