import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateTaskCommand } from './update-task.command'
import { UpdateTaskRequestDto } from './update-task.request.dto'

@Controller('tasks')
export class UpdateTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch('')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Body() request: UpdateTaskRequestDto): Promise<IdResponse> {
    const command = new UpdateTaskCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
