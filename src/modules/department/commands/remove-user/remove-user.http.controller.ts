import { Body, Controller, Param, Post } from '@nestjs/common'
import { RemoveUserRequestDto, RemoveUserRequestParamDto } from './remove-user.request.dto'
import { CommandBus } from '@nestjs/cqrs'
import { RemoveUserCommand } from './remove-user.command'

@Controller('departments')
export class RemoveUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':departmentId/remove-user')
  async remove(@Param() param: RemoveUserRequestParamDto, @Body() request: RemoveUserRequestDto) {
    const command = new RemoveUserCommand({ userId: request.userId, departmentId: param.departmentId })
    await this.commandBus.execute(command)
  }
}
