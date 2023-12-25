import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { AddPositionWorkerCommand } from './add-position-worker.command'
import { AddPositionWorkerParamRequestDto, AddPositionWorkerRequestDto } from './add-position-worker.request.dto'

@Controller('positions')
export class AddPositionWorkerHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':positionId/users')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Body() request: AddPositionWorkerRequestDto,
    @Param() param: AddPositionWorkerParamRequestDto,
  ): Promise<IdResponse> {
    const command = new AddPositionWorkerCommand({
      positionId: param.positionId,
      userId: request.userId,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
