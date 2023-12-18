import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { DeletePositionCommand } from './delete-position.command'
import { DeletePositionParamRequestDto } from './delete-position.request.dto'

@Controller('positions')
export class DeletePositionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete(':positionId')
  @UseGuards(AuthGuard)
  async delete(@User() user: UserEntity, @Param() param: DeletePositionParamRequestDto): Promise<void> {
    const command = new DeletePositionCommand({
      positionId: param.positionId,
    })
    await this.commandBus.execute(command)
  }
}
