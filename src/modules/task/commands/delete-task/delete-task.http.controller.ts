import { CommandBus } from '@nestjs/cqrs'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteTaskCommand } from './delete-task.command'
import { DeleteTaskParamRequestDto } from './delete-task.request.dto'

@Controller('tasks')
export class DeleteTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':taskId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() request: DeleteTaskParamRequestDto): Promise<void> {
    const command = new DeleteTaskCommand(request)
    await this.commandBus.execute(command)
  }
}
