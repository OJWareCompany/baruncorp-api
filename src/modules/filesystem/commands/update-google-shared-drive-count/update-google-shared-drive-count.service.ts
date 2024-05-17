/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateGoogleSharedDriveCountCommand } from './update-google-shared-drive-count.command'
import { PrismaService } from '../../../database/prisma.service'
import { DataIntegrityException } from '../../../../app.error'
import { FilesystemApiService } from '../../infra/filesystem.api.service'

@CommandHandler(UpdateGoogleSharedDriveCountCommand)
export class UpdateGoogleSharedDriveCountService implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesystemApiService: FilesystemApiService,
  ) {}

  async execute(command: UpdateGoogleSharedDriveCountCommand): Promise<void> {
    const jobFolderResult = await this.prismaService.googleJobFolder.update({
      where: { id: command.jobFolderId },
      data: { count: command.count },
    })

    if (!jobFolderResult.sharedDriveId) {
      throw new DataIntegrityException("jobFolder record don't have sharedDriveId.")
    }

    const sharedDriveResult = await this.prismaService.googleSharedDrive.update({
      where: { id: jobFolderResult.sharedDriveId },
      data: {
        count: { increment: command.count },
      },
    })

    const sharedDriveCount = sharedDriveResult.count ?? 0
    if (sharedDriveCount >= 320000) {
      const currentSharedDriveVersion = sharedDriveResult.version ?? '001'
      const nextSharedDriveVersion = String(parseInt(currentSharedDriveVersion) + 1).padStart(3, '0')

      const createGoogleSharedDriveResponseData = await this.filesystemApiService.requestToCreateGoogleSharedDrive(
        `${sharedDriveResult.organizationName} ${nextSharedDriveVersion}`,
      )
      const { sharedDrive, residentialFolder, commercialFolder } = createGoogleSharedDriveResponseData

      await this.prismaService.googleSharedDrive.create({
        data: {
          id: sharedDrive.id,
          residentialFolderId: residentialFolder.id,
          commercialFolderId: commercialFolder.id,
          organizationId: sharedDriveResult.organizationId,
          organizationName: sharedDriveResult.organizationName,
          count: 0,
          version: nextSharedDriveVersion,
        },
      })
    }
  }
}
