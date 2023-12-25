import { CommandBus } from '@nestjs/cqrs'
import { Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteInvoiceCommand } from './delete-invoice.command'
import { DeleteInvoiceParamRequestDto } from './delete-invoice.request.dto'

@Controller('invoices')
export class DeleteInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':invoiceId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeleteInvoiceParamRequestDto): Promise<void> {
    const command = new DeleteInvoiceCommand({
      invoiceId: param.invoiceId,
    })
    await this.commandBus.execute(command)
  }
}
