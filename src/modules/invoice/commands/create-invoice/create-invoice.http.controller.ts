import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateInvoiceCommand } from './create-invoice.command'
import { CreateInvoiceRequestDto } from './create-invoice.request.dto'

@Controller('invoices')
export class CreateInvoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreateInvoiceRequestDto): Promise<IdResponse> {
    const command = new CreateInvoiceCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
