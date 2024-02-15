import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UpdateVendorInvoicedTotalCommand } from './update-vendor-invoiced-total.command'
import {
  UpdateVendorInvoicedTotalRequestDto,
  UpdateVendorInvoicedTotalParamRequestDto,
} from './update-vendor-invoiced-total.request.dto'

@Controller('vendor-invoices')
export class UpdateVendorInvoicedTotalHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':vendorInvoiceId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateVendorInvoicedTotalParamRequestDto,
    @Body() request: UpdateVendorInvoicedTotalRequestDto,
  ): Promise<void> {
    const command = new UpdateVendorInvoicedTotalCommand({
      vendorInvoiceId: param.vendorInvoiceId,
      total: request.total,
    })
    await this.commandBus.execute(command)
  }
}
