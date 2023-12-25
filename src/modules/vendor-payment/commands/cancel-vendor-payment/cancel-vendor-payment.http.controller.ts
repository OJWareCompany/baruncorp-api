import { CommandBus } from '@nestjs/cqrs'
import { Param, Controller, UseGuards, Patch } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CancelVendorPaymentCommand } from './cancel-vendor-payment.command'
import { CancelVendorPaymentParamRequestDto } from './cancel-vendor-payment.request.dto'

@Controller('vendor-payments')
export class CancelVendorPaymentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':vendorPaymentId')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: CancelVendorPaymentParamRequestDto): Promise<void> {
    const command = new CancelVendorPaymentCommand({
      vendorPaymentId: param.vendorPaymentId,
    })
    await this.commandBus.execute(command)
  }
}
