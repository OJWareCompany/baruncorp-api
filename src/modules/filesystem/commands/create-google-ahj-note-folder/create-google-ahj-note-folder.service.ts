/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateGoogleAhjNoteFolderCommand } from './create-google-ahj-note-folder.command'
import { PrismaService } from '../../../database/prisma.service'
import { GoogleAhjNoteFolderDomainService } from '../../domain/domain-service/google-ahj-note-folder.domain-service'
import { AhjNoteFolderData } from '../../infra/filesystem.api.type'

@CommandHandler(CreateGoogleAhjNoteFolderCommand)
export class CreateGoogleAhjNoteFolderService implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleAhjNoteFolderDomainService: GoogleAhjNoteFolderDomainService,
  ) {}
  async execute(command: CreateGoogleAhjNoteFolderCommand): Promise<void> {
    const geoId = command.geoId
    const ahjNote = await this.prismaService.aHJNotes.findUniqueOrThrow({
      where: { geoId },
    })
    const ahjNoteFolder = await this.prismaService.googleAhjNotesFolder.findFirst({
      where: { geoId },
    })
    const ahjNoteFolderData: AhjNoteFolderData =
      ahjNoteFolder && ahjNoteFolder.id
        ? {
            operation: 'update-ahj',
            data: {
              folderId: ahjNoteFolder.id,
              updateName: ahjNote.fullAhjName,
              geoId,
            },
          }
        : {
            operation: 'create-ahj',
            data: {
              createName: ahjNote.fullAhjName,
              geoId,
            },
          }

    await this.googleAhjNoteFolderDomainService.createAhjNoteFolders([ahjNoteFolderData])
  }
}
