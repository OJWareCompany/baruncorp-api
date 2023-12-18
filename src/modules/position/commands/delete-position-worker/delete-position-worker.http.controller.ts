import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeletePositionWorkerCommand } from './delete-position-worker.command'
import { DeletePositionWorkerParamRequestDto } from './delete-position-worker.request.dto'

@Controller('positions')
export class DeletePositionWorkerHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':positionId/users/:userId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeletePositionWorkerParamRequestDto): Promise<void> {
    const command = new DeletePositionWorkerCommand({
      positionId: param.positionId,
      userId: param.userId,
    })
    await this.commandBus.execute(command)
  }
}
