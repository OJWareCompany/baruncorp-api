import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'
import { ClientNoteResponseDto } from './client-note.response.dto'

export class ClientNotePaginatedResponseDto extends PaginatedResponseDto<ClientNoteResponseDto> {
  @ApiProperty({ type: ClientNoteResponseDto, isArray: true })
  items: readonly ClientNoteResponseDto[]
}
