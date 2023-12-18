import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeletePositionTaskCommand } from './delete-position-task.command'
import { DeletePositionTaskParamRequestDto } from './delete-position-task.request.dto'

@Controller('positions')
export class DeletePositionTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':positionId/tasks/:taskId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeletePositionTaskParamRequestDto): Promise<void> {
    const command = new DeletePositionTaskCommand({
      positionId: param.positionId,
      taskId: param.taskId,
    })
    await this.commandBus.execute(command)
  }
}
