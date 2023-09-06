import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, HttpStatus, Param, Patch } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../../../modules/users/domain/user.entity'
import { UpdateOrderedTaskRequestDto, UpdateOrderedTaskRequestParam } from './update-ordered-task.request.dto'
import { UpdateOrderedTaskCommand } from './update-ordered-task.command'
import { ApiResponse } from '@nestjs/swagger'

@Controller('ordered-tasks')
export class UpdateOrderedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedTaskId')
  @ApiResponse({ status: HttpStatus.OK })
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateOrderedTaskRequestParam,
    @Body() request: UpdateOrderedTaskRequestDto,
  ): Promise<void> {
    const command = new UpdateOrderedTaskCommand({
      orderedTaskId: param.orderedTaskId,
      ...request,
    })

    await this.commandBus.execute(command)
  }
}
