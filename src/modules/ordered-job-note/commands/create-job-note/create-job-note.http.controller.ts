import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CreateJobNoteCommand } from './create-job-note.command'
import { CreateJobNoteRequestDto } from './create-job-note.request.dto'
import { CreateJobNoteResponseDto } from '../../dtos/create-job-note.response.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FileExceptionFilter } from '@libs/exceptions/file-exception.filter'

@Controller('ordered-job-notes')
export class CreateJobNoteHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateJobNoteResponseDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 25 * 1024 * 1024 }, // 파일 크기 제한 25MB
    }),
  )
  @UseFilters(new FileExceptionFilter())
  async create(
    @User() user: UserEntity,
    @Body() request: CreateJobNoteRequestDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CreateJobNoteResponseDto> {
    console.log(request.receiverEmails)
    const command: CreateJobNoteCommand = new CreateJobNoteCommand({
      jobId: request.jobId,
      creatorUserId: user.id,
      content: request.content,
      emailBody: request.emailBody ?? '',
      type: request.type,
      receiverEmails: request.receiverEmails ?? null,
      files: files,
    })
    return await this.commandBus.execute(command)
  }
}
