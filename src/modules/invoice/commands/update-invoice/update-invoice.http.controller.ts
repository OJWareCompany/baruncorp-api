import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateInvoiceCommand } from './update-invoice.command'
import { UpdateInvoiceRequestDto, UpdateInvoiceParamRequestDto } from './update-invoice.request.dto'

@Controller('invoices')
export class UpdateInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':invoiceId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateInvoiceParamRequestDto,
    @Body() request: UpdateInvoiceRequestDto,
  ): Promise<void> {
    const command = new UpdateInvoiceCommand({
      invoiceId: param.invoiceId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
