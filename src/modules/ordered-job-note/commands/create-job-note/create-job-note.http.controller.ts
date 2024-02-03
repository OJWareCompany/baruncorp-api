import { Body, Controller, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobNoteCommand } from './create-job-note.command'
import { CreateJobNoteRequestDto } from './create-job-note.request.dto'
import { CreateJobNoteResponseDto } from '../../dtos/create-job-note.response.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JobNoteTypeEnum } from '../../domain/job-note.type'

@Controller('ordered-job-notes')
export class CreateJobNoteHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @User() user: UserEntity,
    @Body() request: CreateJobNoteRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateJobNoteResponseDto> {
    const command: CreateJobNoteCommand = new CreateJobNoteCommand({
      jobId: request.jobId,
      creatorUserId: user.id,
      content: request.content,
      type: request.type,
      receiverEmails: request.receiverEmails,
      files: files,
    })
    return await this.commandBus.execute(command)
  }
}
