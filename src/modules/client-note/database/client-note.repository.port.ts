import { Prisma } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import { ClientNoteSnapshotEntity } from '../domain/client-note-snapshot.entity'
import { ClientNoteEntity } from '../domain/client-note.entity'

export interface ClientNoteRepositoryPort {
  insert(entity: ClientNoteEntity): Promise<void>
  insertSnapshot(entity: ClientNoteSnapshotEntity): Promise<void>
  update(entity: ClientNoteEntity): Promise<void>
  findOne(id: string): Promise<ClientNoteEntity | null>
  findMany(condition: Prisma.ClientNotesWhereInput, offset: number, limit: number): Promise<ClientNoteEntity[]>
  getCount(condition: Prisma.ClientNotesWhereInput): Promise<number>
}
