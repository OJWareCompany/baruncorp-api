import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../auth/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { CommandBus } from '@nestjs/cqrs'
import { RejectAssignedTaskCommand } from './reject-assigned-task.command'
import { RejectAssignedTaskParamRequestDto, RejectAssignedTaskRequestDto } from './reject-assigned-task.request.dto'

@Controller('assigned-tasks')
export class RejectAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':assignedTaskId/reject')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: RejectAssignedTaskParamRequestDto,
    @Body() request: RejectAssignedTaskRequestDto,
  ): Promise<void> {
    const command = new RejectAssignedTaskCommand({
      assignedTaskId: param.assignedTaskId,
      reason: request.reason,
      userId: user.id,
    })
    const result = await this.commandBus.execute(command)
    return Promise.resolve()
  }
}
