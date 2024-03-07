import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { BackToNotStartedAssignedTaskRequestParamDto } from './back-to-not-started-assigned-task.request.dto'
import { BackToNotStartedAssignedTaskCommand } from './back-to-not-started-assigned-task.command'

@Controller('assigned-tasks')
export class BackToNotStartedAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':assignedTaskId/back-to-not-started')
  @UseGuards(AuthGuard)
  async backToNotStarted(@User() user: UserEntity, @Param() param: BackToNotStartedAssignedTaskRequestParamDto) {
    const command = new BackToNotStartedAssignedTaskCommand({
      assignedTaskId: param.assignedTaskId,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
