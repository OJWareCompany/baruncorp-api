import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import {
  ModifyAssignmentTypeOfAvailableTaskRequestDto,
  ModifyAssignmentTypeOfAvailableTaskRequestParamDto,
} from './modify-assignment-type-of-available-task.request'
import { CommandBus } from '@nestjs/cqrs'
import { ModifyAssignmentTypeOfAvailableTaskCommand } from './modify-assignment-type-of-available-task.commnad'
import { AuthGuard } from '../../../auth/authentication.guard'

@Controller('users')
export class ModifyAssignmentTypeOfAvailableTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':userId/available-tasks/:taskId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Body() request: ModifyAssignmentTypeOfAvailableTaskRequestDto,
    @Param() param: ModifyAssignmentTypeOfAvailableTaskRequestParamDto,
  ) {
    const command = new ModifyAssignmentTypeOfAvailableTaskCommand({
      userId: param.userId,
      taskId: param.taskId,
      autoAssignmentType: request.autoAssignmentType,
    })

    const result = await this.commandBus.execute(command)
  }
}
