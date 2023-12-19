import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { AddAvailableTaskRequestDto, AddAvailableTaskRequestParamDto } from './add-available-task.request'
import { CommandBus } from '@nestjs/cqrs'
import { AddAvailableTaskCommand } from './add-available-task.commnad'
import { AuthGuard } from '../../../auth/authentication.guard'

@Controller('users')
export class AddAvailableTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':userId/available-tasks')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Body() request: AddAvailableTaskRequestDto,
    @Param() param: AddAvailableTaskRequestParamDto,
  ) {
    const command = new AddAvailableTaskCommand({
      userId: param.userId,
      taskId: request.taskId,
      autoAssignmentType: request.autoAssignmentType,
    })

    const result = await this.commandBus.execute(command)
  }
}
