import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobNoteCommand } from './create-job-note.command'
import { CreateJobNoteRequestDto } from './create-job-note.request.dto'
import { CreateJobNoteResponseDto } from '../../dtos/create-job-note.response.dto'

@Controller('ordered-job-notes')
export class CreateJobNoteHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  async create(@User() user: UserEntity, @Body() request: CreateJobNoteRequestDto): Promise<CreateJobNoteResponseDto> {
    const command = new CreateJobNoteCommand({
      jobId: request.jobId,
      creatorUserId: user.id,
      content: request.content,
      type: request.type,
      receiverEmails: request.receiverEmails,
    })
    const result: CreateJobNoteResponseDto = await this.commandBus.execute(command)
    return result
  }
}
