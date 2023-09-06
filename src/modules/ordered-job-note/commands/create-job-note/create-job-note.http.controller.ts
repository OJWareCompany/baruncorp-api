import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiResponse } from '@nestjs/swagger'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobNoteCommand } from './create-job-note.command'
import { CreateJobNoteRequestDto } from './create-job-note.request.dto'
import { IdResponse } from '../../../../libs/api/id.response.dto'

@Controller('ordered-job-notes')
export class CreateJobNoteHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED })
  @UseGuards(AuthGuard)
  async create(@User() user: UserEntity, @Body() request: CreateJobNoteRequestDto): Promise<IdResponse> {
    const command = new CreateJobNoteCommand({
      content: request.content,
      jobId: request.jobId,
      commenterUserId: user.id,
    })
    const result = await this.commandBus.execute(command)
    return new IdResponse(result.id)
  }
}
