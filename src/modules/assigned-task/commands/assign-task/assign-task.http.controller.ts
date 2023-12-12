import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { AssignTaskCommand } from './assign-task.command'
import { AssignTaskParamRequestDto, AssignTaskRequestDto } from './assign-task.request.dto'

@Controller('assigned-tasks')
export class AssignTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':assignedTaskId/assign')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: AssignTaskParamRequestDto,
    @Body() request: AssignTaskRequestDto,
  ): Promise<void> {
    const command = new AssignTaskCommand({
      assignedTaskId: param.assignedTaskId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
