/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { AggregateID } from '@src/libs/ddd/entity.base'
import { CreateClientNoteCommand } from './create-client-note.command'
import { ClientNoteEntity } from '../../domain/client-note.entity'
import { ClientNoteRepositoryPort } from '../../database/client-note.repository.port'
import { ClientNoteSnapshotEntity } from '../../domain/client-note-snapshot.entity'
import { CLIENT_NOTE_REPOSITORY } from '../../client-note.di-token'
import { ClientNoteTypeEnum } from '../../domain/client-note-snapshot.type'

@CommandHandler(CreateClientNoteCommand)
export class CreateClientNoteService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(CLIENT_NOTE_REPOSITORY) private readonly clientNoteRepository: ClientNoteRepositoryPort,
  ) {}
  async execute(command: CreateClientNoteCommand): Promise<AggregateID> {
    const clientNoteEntity: ClientNoteEntity = ClientNoteEntity.create({
      organizationId: command.organizationId,
    })

    const snapshotEntity: ClientNoteSnapshotEntity = ClientNoteSnapshotEntity.create({
      clientNoteId: clientNoteEntity.id,
      updatedBy: command.updatedBy,
      designNotes: command.designNotes,
      electricalEngineeringNotes: command.electricalEngineeringNotes,
      structuralEngineeringNotes: command.structuralEngineeringNotes,
      type: ClientNoteTypeEnum.Create,
    })

    await this.clientNoteRepository.insert(clientNoteEntity)
    await this.clientNoteRepository.insertSnapshot(snapshotEntity)
    return clientNoteEntity.id
  }
}
