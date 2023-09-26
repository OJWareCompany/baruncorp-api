import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeleteTaskCommand } from './delete-task.command'
import { DeleteTaskRequestDto } from './delete-task.request.dto'

@Controller('tasks')
export class DeleteTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete('')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Body() request: DeleteTaskRequestDto): Promise<IdResponse> {
    const command = new DeleteTaskCommand(request)
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
