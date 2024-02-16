import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { UserEntity } from '../../../users/domain/user.entity'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CreatePaymentRequestDto } from './create-payment.request.dto'
import { CreatePaymentCommand } from './create-payment.command'

@Controller('payments')
export class CreatePaymentHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '크레딧 결제는 POST /credit-transactions API를 사용합니다.' })
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreatePaymentRequestDto): Promise<IdResponse> {
    const command = new CreatePaymentCommand({
      ...request,
      createdBy: user.id,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
