import { UtilitySnapshotEntity } from '../domain/utility-snapshot.entity'
import { Prisma } from '@prisma/client'
import { UtilityEntity } from '@modules/utility/domain/utility.entity'
import { ClientNoteEntity } from '@modules/client-note/domain/client-note.entity'

export interface UtilityRepositoryPort {
  insert(entity: UtilityEntity): Promise<void>
  insertSnapshot(entity: UtilitySnapshotEntity): Promise<void>
  update(entity: UtilityEntity): Promise<void>

  findOne(id: string): Promise<UtilityEntity | null>
}
