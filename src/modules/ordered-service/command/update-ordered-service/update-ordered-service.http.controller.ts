import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateOrderedServiceCommand } from './update-ordered-service.command'
import { UpdateOrderedServiceRequestDto } from './update-ordered-service.request.dto'

@Controller('update-ordered-service')
export class UpdateOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async createJob(@User() user: UserEntity, @Body() request: UpdateOrderedServiceRequestDto): Promise<IdResponse> {
    const command = new UpdateOrderedServiceCommand(request)
    const result = await this.commandBus.execute(command)
    return new IdResponse(result.id)
  }
}
