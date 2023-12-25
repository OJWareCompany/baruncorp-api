import { Body, Controller, Delete, Param, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeletePrerequisiteTaskRequestParamDto } from './delete-prerequisite-task.request.dto'
import { CommandBus } from '@nestjs/cqrs'
import { DeletePrerequisiteTaskCommand } from './delete-prerequisite-task.command'
import { AuthGuard } from '../../../auth/guards/authentication.guard'

@Controller('tasks')
export class DeletePrerequisiteTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':taskId/pre-task/:prerequisiteTaskId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeletePrerequisiteTaskRequestParamDto) {
    const command = new DeletePrerequisiteTaskCommand({
      taskId: param.taskId,
      prerequisiteTaskId: param.prerequisiteTaskId,
    })
    await this.commandBus.execute(command)
  }
}
