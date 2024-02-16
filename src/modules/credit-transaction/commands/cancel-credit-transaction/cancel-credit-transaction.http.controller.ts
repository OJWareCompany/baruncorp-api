import { Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CancelCreditTransactionParamRequestDto } from './cancel-credit-transaction.request.dto'
import { CancelCreditTransactionCommand } from './cancel-credit-transaction.command'

@Controller('credit-transactions')
export class CancelCreditTransactionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':creditTransactionId/cancel')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: CancelCreditTransactionParamRequestDto): Promise<void> {
    const command = new CancelCreditTransactionCommand({
      creditTransactionId: param.creditTransactionId,
    })
    await this.commandBus.execute(command)
  }
}
