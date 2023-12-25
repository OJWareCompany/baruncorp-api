import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { DeleteAvailableTaskRequestParamDto } from './delete-available-task.request'
import { CommandBus } from '@nestjs/cqrs'
import { DeleteAvailableTaskCommand } from './delete-available-task.commnad'
import { AuthGuard } from '../../../auth/guards/authentication.guard'

@Controller('users')
export class DeleteAvailableTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':userId/available-tasks/:taskId')
  @UseGuards(AuthGuard)
  async delete(
    @User() user: UserEntity,
    // @Body() request: DeleteAvailableTaskRequestDto,
    @Param() param: DeleteAvailableTaskRequestParamDto,
  ) {
    const command = new DeleteAvailableTaskCommand({
      userId: param.userId,
      taskId: param.taskId,
    })

    const result = await this.commandBus.execute(command)
  }
}
