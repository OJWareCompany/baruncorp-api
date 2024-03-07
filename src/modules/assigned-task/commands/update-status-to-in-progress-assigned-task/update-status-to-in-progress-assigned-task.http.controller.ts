import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UpdateStatusToInProgressAssignedTaskRequestParamDto } from './update-status-to-in-progress-assigned-task.request.dto'
import { UpdateStatusToInProgressAssignedTaskCommand } from './update-status-to-in-progress-assigned-task.command'

@Controller('assigned-tasks')
export class UpdateStatusToInProgressAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':assignedTaskId/update-to-in-progress')
  @UseGuards(AuthGuard)
  async hold(@User() user: UserEntity, @Param() param: UpdateStatusToInProgressAssignedTaskRequestParamDto) {
    const command = new UpdateStatusToInProgressAssignedTaskCommand({
      assignedTaskId: param.assignedTaskId,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
