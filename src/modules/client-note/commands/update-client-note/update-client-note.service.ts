/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { CLIENT_NOTE_REPOSITORY } from '../../client-note.di-token'
import { UpdateClientNoteCommand } from './update-client-note.command'
import { ClientNoteSnapshotEntity } from '../../domain/client-note-snapshot.entity'
import { ClientNoteNotFoundException } from '../../domain/client-note.error'
import { ClientNoteRepositoryPort } from '../../database/client-note.repository.port'
import { ClientNoteTypeEnum } from '../../domain/client-note-snapshot.type'

@CommandHandler(UpdateClientNoteCommand)
export class UpdateClientNoteService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CLIENT_NOTE_REPOSITORY) private readonly clientNoteRepository: ClientNoteRepositoryPort,
  ) {}
  async execute(command: UpdateClientNoteCommand): Promise<void> {
    const entity = await this.clientNoteRepository.findOne(command.clientNoteId)
    if (!entity) throw new ClientNoteNotFoundException()

    const historyEntitiy: ClientNoteSnapshotEntity = ClientNoteSnapshotEntity.create({
      clientNoteId: command.clientNoteId,
      designNotes: command.designNotes,
      electricalEngineeringNotes: command.electricalEngineeringNotes,
      structuralEngineeringNotes: command.structuralEngineeringNotes,
      updatedBy: command.updatedBy,
      type: ClientNoteTypeEnum.Modify,
    })
    await this.clientNoteRepository.insertSnapshot(historyEntitiy)
  }
}
