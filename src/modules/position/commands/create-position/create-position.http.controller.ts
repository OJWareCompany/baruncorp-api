import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreatePositionCommand } from './create-position.command'
import { CreatePositionRequestDto } from './create-position.request.dto'

@Controller('positions')
export class CreatePositionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Body() request: CreatePositionRequestDto): Promise<IdResponse> {
    const command = new CreatePositionCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
