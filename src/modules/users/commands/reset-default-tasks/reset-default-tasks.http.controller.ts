import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { ResetDefaultTasksRequestParamDto } from './reset-default-tasks.request'
import { CommandBus } from '@nestjs/cqrs'
import { ResetDefaultTasksCommand } from './reset-default-tasks.command'
import { AuthGuard } from '../../../auth/guards/authentication.guard'

@Controller('users')
export class ResetDefaultTasksHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':userId/reset-default-tasks')
  @UseGuards(AuthGuard)
  async post(@Param() param: ResetDefaultTasksRequestParamDto) {
    const command = new ResetDefaultTasksCommand({
      userId: param.userId,
    })

    await this.commandBus.execute(command)
  }
}
