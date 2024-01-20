import { Paginated } from '../../../libs/ddd/repository.port'
import { InformationHistoryEntity } from '../domain/information-history.entity'
import { InformationEntity } from '../domain/information.entity'

export interface InformationRepositoryPort {
  insert(entity: InformationEntity): Promise<void>
  insertHistory(entity: InformationHistoryEntity): Promise<void>
  update(entity: InformationEntity): Promise<void>
  findOne(id: string): Promise<InformationEntity | null>
  findMany(offset: number, limit: number): Promise<InformationEntity[]>
  getCount(): Promise<number>
}
