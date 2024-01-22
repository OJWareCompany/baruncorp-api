import { CommandBus } from '@nestjs/cqrs'
import { Body, Param, Controller, Patch, UseGuards, Post } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateClientNoteCommand } from './create-client-note.command'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { CreateClientNoteRequestDto } from './create-client-note.request.dto'

@Controller('client-note')
export class CreateClientNoteHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  @UseGuards(AuthGuard)
  async patch(@Body() dto: CreateClientNoteRequestDto, @User() user: UserEntity): Promise<IdResponse> {
    const command = new CreateClientNoteCommand({
      ...dto,
      updatedBy: user.id,
    })
    const result: AggregateID = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
