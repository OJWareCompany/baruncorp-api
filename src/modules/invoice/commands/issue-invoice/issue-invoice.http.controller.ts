import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { IssueInvoiceCommand } from './issue-invoice.command'
import { IssueInvoiceRequestDto, IssueInvoiceParamRequestDto } from './issue-invoice.request.dto'

@Controller('invoices')
export class IssueInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':invoiceId/issue')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: IssueInvoiceParamRequestDto,
    @Body() request: IssueInvoiceRequestDto,
  ): Promise<void> {
    const command = new IssueInvoiceCommand({
      invoiceId: param.invoiceId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
