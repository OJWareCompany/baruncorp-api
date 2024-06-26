import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Payments } from '@prisma/client'
import { FindClientNoteRequestDto } from './find-client-note.request.dto'
import { FindClientNoteQuery } from './find-client-note.query-handler'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { ClientNoteDetailResponseDto } from '../../dtos/client-note-detail.response.dto'

@Controller('client-note')
export class FindClientNoteHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':clientNoteId')
  @UseGuards(AuthGuard)
  async get(@Param() param: FindClientNoteRequestDto): Promise<ClientNoteDetailResponseDto> {
    const command = new FindClientNoteQuery(param)
    const result: ClientNoteDetailResponseDto = await this.queryBus.execute(command)

    return result
  }
}
