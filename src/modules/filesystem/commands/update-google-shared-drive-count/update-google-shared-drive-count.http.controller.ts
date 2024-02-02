import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Patch } from '@nestjs/common'
import { UpdateGoogleSharedDriveCountRequestDto } from './update-google-shared-drive-count.request.dto'
import { UpdateGoogleSharedDriveCountCommand } from './update-google-shared-drive-count.command'

@Controller('google-shared-drive-count')
export class UpdateGoogleSharedDriveCountHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch('')
  async patch(@Body() request: UpdateGoogleSharedDriveCountRequestDto): Promise<void> {
    const command = new UpdateGoogleSharedDriveCountCommand({
      jobFolderId: request.jobFolderId,
      count: request.count,
    })
    await this.commandBus.execute(command)
  }
}
