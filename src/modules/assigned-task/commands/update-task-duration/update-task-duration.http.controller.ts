import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateTaskDurationCommand } from './update-task-duration.command'
import { UpdateTaskDurationRequestDto, UpdateTaskDurationParamRequestDto } from './update-task-duration.request.dto'

@Controller('assigned-tasks')
export class UpdateTaskDurationHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':assignedTaskId/duration')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateTaskDurationParamRequestDto,
    @Body() request: UpdateTaskDurationRequestDto,
  ): Promise<void> {
    const command = new UpdateTaskDurationCommand({
      assignedTaskId: param.assignedTaskId,
      ...request,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
