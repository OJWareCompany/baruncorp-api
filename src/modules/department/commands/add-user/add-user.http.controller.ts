import { Body, Controller, Param, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { AddUserRequestDto, AddUserRequestParamDto } from './add-user.request.dto'
import { AddUserCommand } from './add-user.command'

@Controller('departments')
export class AddUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':departmentId/add-user')
  async add(@Param() param: AddUserRequestParamDto, @Body() request: AddUserRequestDto) {
    const command = new AddUserCommand({ userId: request.userId, departmentId: param.departmentId })
    await this.commandBus.execute(command)
  }
}
