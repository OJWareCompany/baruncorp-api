import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateTaskCommand } from './update-task.command'
import { UpdateTaskParamRequestDto, UpdateTaskRequestDto } from './update-task.request.dto'

@Controller('tasks')
export class UpdateTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':taskId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateTaskParamRequestDto,
    @Body() request: UpdateTaskRequestDto,
  ): Promise<void> {
    const command = new UpdateTaskCommand({
      taskId: param.taskId,
      name: request.name,
      licenseType: request.licenseTyp,
    })
    await this.commandBus.execute(command)
  }
}
