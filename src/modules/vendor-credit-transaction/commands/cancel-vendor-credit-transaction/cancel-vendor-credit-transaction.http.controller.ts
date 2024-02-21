import { Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CancelVendorCreditTransactionParamRequestDto } from './cancel-vendor-credit-transaction.request.dto'
import { CancelVendorCreditTransactionCommand } from './cancel-vendor-credit-transaction.command'

@Controller('vendor-credit-transactions')
export class CancelVendorCreditTransactionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':vendorCreditTransactionId/cancel')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: CancelVendorCreditTransactionParamRequestDto): Promise<void> {
    const command = new CancelVendorCreditTransactionCommand({
      vendorCreditTransactionId: param.vendorCreditTransactionId,
    })
    await this.commandBus.execute(command)
  }
}
