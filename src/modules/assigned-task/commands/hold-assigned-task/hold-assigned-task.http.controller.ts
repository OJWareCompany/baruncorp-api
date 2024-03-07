import { CommandBus } from '@nestjs/cqrs'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { HoldAssignedTaskRequestParamDto } from './hold-assigned-task.request.dto'
import { HoldAssignedTaskCommand } from './hold-assigned-task.command'

@Controller('assigned-tasks')
export class HoldAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':assignedTaskId/hold')
  @UseGuards(AuthGuard)
  async hold(@User() user: UserEntity, @Param() param: HoldAssignedTaskRequestParamDto) {
    const command = new HoldAssignedTaskCommand({ assignedTaskId: param.assignedTaskId, editorUserId: user.id })
    await this.commandBus.execute(command)
  }
}
