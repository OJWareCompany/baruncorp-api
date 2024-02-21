import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post } from '@nestjs/common'
import { CreateGoogleAhjNoteFolderRequestDto } from './create-google-ahj-note-folder.request.dto'
import { CreateGoogleAhjNoteFolderCommand } from './create-google-ahj-note-folder.command'

@Controller('google-ahj-note-folder')
export class CreateGoogleAhjNoteFolderHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  async post(@Body() request: CreateGoogleAhjNoteFolderRequestDto): Promise<void> {
    const command = new CreateGoogleAhjNoteFolderCommand({ geoId: request.geoId })
    await this.commandBus.execute(command)
  }
}
