/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateGoogleJobNoteFolderCommand } from './create-google-job-note-folder.command'
import { GOOGLE_JOB_NOTE_FOLDER_REPOSITORY } from '../../filesystem.di-token'
import { GoogleJobNoteFolderRepository } from '../../database/google-job-note-folder.repository'
import { GoogleJobNoteFolderEntity } from '../../domain/google-job-note-folder.entity'

@CommandHandler(CreateGoogleJobNoteFolderCommand)
export class CreateGoogleJobNoteFolderService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(GOOGLE_JOB_NOTE_FOLDER_REPOSITORY)
    private readonly googleJobNoteFolderRepository: GoogleJobNoteFolderRepository,
  ) {}
  async execute(command: CreateGoogleJobNoteFolderCommand): Promise<void> {
    const entity = GoogleJobNoteFolderEntity.create({
      folderId: command.folderId,
      shareLink: command.shareLink,
      jobNotesFolderId: command.jobNotesFolderId,
      jobNoteId: command.jobNoteId,
      sharedDriveId: command.sharedDriveId,
    })
    await this.googleJobNoteFolderRepository.insertOne(entity)
  }
}
