import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateAssignedTaskCommand } from './update-assigned-task.command'
import { UpdateAssignedTaskParamRequestDto, UpdateAssignedTaskRequestDto } from './update-assigned-task.request.dto'

@Controller('assigned-tasks')
export class UpdateAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':assignedTaskId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateAssignedTaskParamRequestDto,
    @Body() request: UpdateAssignedTaskRequestDto,
  ): Promise<void> {
    const command = new UpdateAssignedTaskCommand({
      assignedTaskId: param.assignedTaskId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
