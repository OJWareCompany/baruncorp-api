import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateTaskCostCommand } from './update-task-cost.command'
import { UpdateTaskCostRequestDto, UpdateTaskCostParamRequestDto } from './update-task-cost.request.dto'

@Controller('assigned-tasks')
export class UpdateTaskCostHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':assignedTaskId/cost')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateTaskCostParamRequestDto,
    @Body() request: UpdateTaskCostRequestDto,
  ): Promise<void> {
    const command = new UpdateTaskCostCommand({
      ...request,
      assignedTaskId: param.assignedTaskId,
      editorUserId: user.id,
    })
    await this.commandBus.execute(command)
  }
}
