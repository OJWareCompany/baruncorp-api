import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateOrderedServiceCommand } from './create-ordered-service.command'
import { CreateOrderedServiceRequestDto } from './create-ordered-service.request.dto'

@Controller('create-ordered-service')
export class CreateOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() request: CreateOrderedServiceRequestDto): Promise<IdResponse> {
    const command = new CreateOrderedServiceCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
