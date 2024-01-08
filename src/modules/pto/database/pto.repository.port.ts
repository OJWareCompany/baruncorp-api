import { Paginated } from '../../../libs/ddd/repository.port'
import { PtoEntity } from '../domain/pto.entity'

export interface PtoRepositoryPort {
  insert(entity: PtoEntity): Promise<void>
  update(entity: PtoEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<PtoEntity | null>
  findMany(offset: number, limit: number): Promise<PtoEntity[]>
  getCount(): Promise<number>
}
