import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateUtilityCommand } from './update-utility.command'
import { UpdateClientNoteParamRequestDto, UpdateUtilityRequestDto } from './update-utility.request.dto'

@Controller('utilities')
export class UpdateUtilityHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':utilityId')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdateClientNoteParamRequestDto,
    @Body() request: UpdateUtilityRequestDto,
    @User() user: UserEntity,
  ): Promise<void> {
    const command: UpdateUtilityCommand = new UpdateUtilityCommand({
      utilityId: param.utilityId,
      updatedBy: user.id,
      ...request,
    })

    await this.commandBus.execute(command)
  }
}
