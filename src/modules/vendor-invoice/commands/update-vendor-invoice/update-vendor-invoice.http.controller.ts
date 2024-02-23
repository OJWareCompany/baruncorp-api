import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
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
      invoiceDate: request.invoiceDate,
      terms: request.terms,
      note: request.note,
    })
    await this.commandBus.execute(command)
  }
}
