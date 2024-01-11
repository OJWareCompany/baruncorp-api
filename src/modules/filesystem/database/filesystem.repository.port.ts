import { Paginated } from '../../../libs/ddd/repository.port'
import { FilesystemEntity } from '../domain/filesystem.entity'

export interface FilesystemRepositoryPort {
  insert(entity: FilesystemEntity): Promise<void>
  update(entity: FilesystemEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<FilesystemEntity | null>
  find(): Promise<Paginated<FilesystemEntity>>
}
