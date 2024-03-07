import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { CancelAssignedTaskRequestParamDto } from './cancel-assigned-task.request.dto'
import { CancelAssignedTaskCommand } from './cancel-assigned-task.command'

@Controller('assigned-tasks')
export class CancelAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':assignedTaskId/cancel')
  @UseGuards(AuthGuard)
  async cancel(
    @User() user: UserEntity,
    @Param() cancelAssignedTaskRequestParamDto: CancelAssignedTaskRequestParamDto,
  ) {
    const command = new CancelAssignedTaskCommand({
      assignedTaskId: cancelAssignedTaskRequestParamDto.assignedTaskId,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
