import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateRevisionSizeCommand } from './update-mounting-type.command'
import { UpdateRevisionSizeParamRequestDto, UpdateRevisionSizeRequestDto } from './update-mounting-type.request.dto'

@Controller('ordered-services')
export class UpdateRevisionSizeHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedServiceId/revision-size')
  @UseGuards(AuthGuard)
  async patch(
    @User() user: UserEntity,
    @Param() param: UpdateRevisionSizeParamRequestDto,
    @Body() request: UpdateRevisionSizeRequestDto,
  ): Promise<void> {
    const command = new UpdateRevisionSizeCommand({
      orderedServiceId: param.orderedServiceId,
      revisionSize: request.sizeForRevision,
    })
    await this.commandBus.execute(command)
  }
}
