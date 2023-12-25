import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { AddPositionTaskCommand } from './add-position-task.command'
import { AddPositionTaskParamRequestDto, AddPositionTaskRequestDto } from './add-position-task.request.dto'

@Controller('positions')
export class AddPositionTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':positionId/tasks')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Body() request: AddPositionTaskRequestDto,
    @Param() param: AddPositionTaskParamRequestDto,
  ): Promise<IdResponse> {
    const command = new AddPositionTaskCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
