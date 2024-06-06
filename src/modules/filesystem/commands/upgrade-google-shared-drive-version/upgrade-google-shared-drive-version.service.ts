import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpgradeGoogleSharedDriveVersionCommand } from './upgrade-google-shared-drive-version.command'
import { PrismaService } from '@src/modules/database/prisma.service'
import { FilesystemDomainService } from '../../domain/domain-service/filesystem.domain-service'

@CommandHandler(UpgradeGoogleSharedDriveVersionCommand)
export class UpgradeGoogleSharedDriveVersionService implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesystemDomainService: FilesystemDomainService,
  ) {}
  async execute(command: UpgradeGoogleSharedDriveVersionCommand): Promise<void> {
    const sharedDrives = await this.prismaService.googleSharedDrive.findMany({
      where: {
        isHighestVersion: true,
        count: {
          gt: 320000,
        },
      },
    })

    for (let i = 0; i < sharedDrives.length; i++) {
      const sharedDrive = sharedDrives[i]
      await this.filesystemDomainService.upgradeSharedDriveVersion({
        currentSharedDriveId: sharedDrive.id,
        version: sharedDrive.version ?? '001',
        organizationId: sharedDrive.organizationId,
        organizationName: sharedDrive.organizationName,
      })
    }
  }
}
