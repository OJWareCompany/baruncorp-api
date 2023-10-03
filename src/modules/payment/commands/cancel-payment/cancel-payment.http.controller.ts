import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, UseGuards, Patch } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CancelPaymentCommand } from './cancel-payment.command'
import { CancelPaymentParamRequestDto } from './cancel-payment.request.dto'

@Controller('payments')
export class CancelPaymentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':paymentId')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: CancelPaymentParamRequestDto): Promise<void> {
    const command = new CancelPaymentCommand({
      paymentId: param.paymentId,
    })
    await this.commandBus.execute(command)
  }
}
