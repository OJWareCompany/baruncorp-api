import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreateCreditTransactionRequestDto } from './create-credit-transaction.request.dto'
import { CreateCreditTransactionCommand } from './create-credit-transaction.command'

@Controller('credit-transactions')
export class CreateCreditTransactionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreateCreditTransactionRequestDto): Promise<IdResponse> {
    const command = new CreateCreditTransactionCommand({
      createdByUserId: user.id,
      amount: request.amount,
      creditTransactionType: request.creditTransactionType,
      relatedInvoiceId: request.relatedInvoiceId,
      clientOrganizationId: request.clientOrganizationId,
      note: request.note,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
