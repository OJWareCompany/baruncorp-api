import { CommandBus } from '@nestjs/cqrs'
import { Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CompleteAssignedTaskParamRequestDto } from './complete-assigned-task.request.dto'
import { CompleteAssignedTaskCommand } from './complete-assigned-task.command'

@Controller('assigned-tasks/complete')
export class CompleteAssignedTaskHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':assignedTaskId')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: CompleteAssignedTaskParamRequestDto): Promise<void> {
    const command = new CompleteAssignedTaskCommand(param)
    await this.commandBus.execute(command)
  }
}
