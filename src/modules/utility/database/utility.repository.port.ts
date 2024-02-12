import { UtilitySnapshotEntity } from '../domain/utility-snapshot.entity'
import { Prisma } from '@prisma/client'

export interface UtilityRepositoryPort {
  // insert(entity: UtilityEntity): Promise<void>
  insert(id: string): Promise<void>
  insertSnapshot(entity: UtilitySnapshotEntity): Promise<void>
}
