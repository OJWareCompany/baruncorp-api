import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateVendorInvoiceCommand } from './update-vendor-invoice.command'
import { UpdateVendorInvoiceRequestDto, UpdateVendorInvoiceParamRequestDto } from './update-vendor-invoice.request.dto'

@Controller('vendor-invoices')
export class UpdateVendorInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':vendorInvoiceId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateVendorInvoiceParamRequestDto,
    @Body() request: UpdateVendorInvoiceRequestDto,
  ): Promise<void> {
    const command = new UpdateVendorInvoiceCommand({
      vendorInvoiceId: param.vendorInvoiceId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
