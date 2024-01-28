import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { CommandBus } from '@nestjs/cqrs'
import { UnassignAssignedTaskCommand } from './unassign-assigned-task.command'
import { UnassignTaskParamRequestDto } from './unassign-assigned-task.request.dto'

@Controller('assigned-tasks')
export class UnassignAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':assignedTaskId/unassign')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: UnassignTaskParamRequestDto): Promise<void> {
    const command = new UnassignAssignedTaskCommand({ assignedTaskId: param.assignedTaskId, editorUserId: user.id })
    await this.commandBus.execute(command)
  }
}
