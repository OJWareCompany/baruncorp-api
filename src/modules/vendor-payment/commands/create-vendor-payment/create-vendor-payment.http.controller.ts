import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateVendorPaymentCommand } from './create-vendor-payment.command'
import { CreateVendorPaymentRequestDto } from './create-vendor-payment.request.dto'

@Controller('vendor-payments')
export class CreateVendorPaymentHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreateVendorPaymentRequestDto): Promise<IdResponse> {
    const command = new CreateVendorPaymentCommand({
      ...request,
      createdBy: user.id,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
