import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post } from '@nestjs/common'
import { CreateGoogleJobNoteFolderRequestDto } from './create-google-job-note-folder.request.dto'
import { CreateGoogleJobNoteFolderCommand } from './create-google-job-note-folder.command'

@Controller('google-job-note-folder')
export class CreateGoogleJobNoteFolderHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  async post(@Body() request: CreateGoogleJobNoteFolderRequestDto): Promise<void> {
    const command = new CreateGoogleJobNoteFolderCommand({
      folderId: request.id,
      shareLink: request.shareLink,
      jobNotesFolderId: request.jobNotesFolderId,
      jobNoteId: request.jobNoteId,
    })
    await this.commandBus.execute(command)
  }
}
