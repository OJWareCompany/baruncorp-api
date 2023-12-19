import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePositionOrderCommand } from './update-position-order.command'
import { UpdatePositionOrderParamRequestDto, UpdatePositionOrderRequestDto } from './update-position-order.request.dto'

@Controller('tasks')
export class UpdatePositionOrderHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':taskId/position-order')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdatePositionOrderParamRequestDto,
    @Body() request: UpdatePositionOrderRequestDto,
  ): Promise<void> {
    const command = new UpdatePositionOrderCommand({
      taskId: param.taskId,
      taskPositions: request.taskPositions,
    })
    await this.commandBus.execute(command)
  }
}
