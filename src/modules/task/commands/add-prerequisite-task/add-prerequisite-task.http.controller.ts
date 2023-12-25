import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { AddPrerequisiteTaskCommand } from './add-prerequisite-task.command'
import { AddPrerequisiteTaskRequestDto, AddPrerequisiteTaskRequestParamDto } from './add-prerequisite-task.request.dto'

@Controller('tasks')
export class AddPrerequisiteTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':taskId/pre-tasks')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Body() request: AddPrerequisiteTaskRequestDto,
    @Param() param: AddPrerequisiteTaskRequestParamDto,
  ): Promise<IdResponse> {
    const command = new AddPrerequisiteTaskCommand({
      taskId: param.taskId,
      prerequisiteTaskId: request.prerequisiteTaskId,
    })

    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
