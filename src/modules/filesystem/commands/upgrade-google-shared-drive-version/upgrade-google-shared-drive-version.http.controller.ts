import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Post } from '@nestjs/common'
import { UpgradeGoogleSharedDriveVersionRequestDto } from './upgrade-google-shared-drive-version.dto'
import { UpgradeGoogleSharedDriveVersionCommand } from './upgrade-google-shared-drive-version.command'

@Controller('upgrade-google-shared-drive-version')
export class UpgradeGoogleSharedDriveVersionHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('')
  async patch(@Body() request: UpgradeGoogleSharedDriveVersionRequestDto): Promise<void> {
    const command = new UpgradeGoogleSharedDriveVersionCommand({})
    await this.commandBus.execute(command)
  }
}
