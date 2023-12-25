import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePositionTaskAutoAssignmentTypeCommand } from './update-position-task-autoassignment-type.command'
import {
  UpdatePositionTaskAutoAssignmentTypeRequestDto,
  UpdatePositionTaskAutoAssignmentTypeParamRequestDto,
} from './update-position-task-autoassignment-type.request.dto'

@Controller('positions')
export class UpdatePositionTaskAutoAssignmentTypeHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':positionId/tasks/:taskId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdatePositionTaskAutoAssignmentTypeParamRequestDto,
    @Body() request: UpdatePositionTaskAutoAssignmentTypeRequestDto,
  ): Promise<void> {
    const command = new UpdatePositionTaskAutoAssignmentTypeCommand({
      positionId: param.positionId,
      taskId: param.taskId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
