import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { UpdateClientNoteCommand } from './update-client-note.command'
import { UpdateClientNoteParamRequestDto, UpdateClientNoteRequestDto } from './update-client-note.request.dto'

@Controller('client-note')
export class UpdateClientNoteHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':clientNoteId')
  @UseGuards(AuthGuard)
  async patch(
    @Param() param: UpdateClientNoteParamRequestDto,
    @Body() request: UpdateClientNoteRequestDto,
    @User() user: UserEntity,
  ): Promise<void> {
    const command = new UpdateClientNoteCommand({
      clientNoteId: param.clientNoteId,
      updatedBy: user.id,
      ...request,
    })

    await this.commandBus.execute(command)
  }
}
