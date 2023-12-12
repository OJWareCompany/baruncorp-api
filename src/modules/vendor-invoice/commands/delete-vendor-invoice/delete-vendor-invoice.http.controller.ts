import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteVendorInvoiceCommand } from './delete-vendor-invoice.command'
import { DeleteVendorInvoiceRequestDto, DeleteVendorInvoiceParamRequestDto } from './delete-vendor-invoice.request.dto'

@Controller('vendor-invoices')
export class DeleteVendorInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':vendorInvoiceId')
  @UseGuards(AuthGuard)
  async delete(
    @User() user: UserEntity,
    @Param() param: DeleteVendorInvoiceParamRequestDto,
    @Body() request: DeleteVendorInvoiceRequestDto,
  ): Promise<void> {
    const command = new DeleteVendorInvoiceCommand({
      vendorInvoiceId: param.vendorInvoiceId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
