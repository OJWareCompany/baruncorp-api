import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdatePositionCommand } from './update-position.command'
import { UpdatePositionRequestDto, UpdatePositionParamRequestDto } from './update-position.request.dto'

@Controller('positions')
export class UpdatePositionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':positionId')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdatePositionParamRequestDto,
    @Body() request: UpdatePositionRequestDto,
  ): Promise<void> {
    const command = new UpdatePositionCommand({
      positionId: param.positionId,
      ...request,
    })
    await this.commandBus.execute(command)
  }
}
