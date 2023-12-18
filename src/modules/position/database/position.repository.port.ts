import { Paginated } from '../../../libs/ddd/repository.port'
import { PositionEntity } from '../domain/position.entity'

export interface PositionRepositoryPort {
  insert(entity: PositionEntity): Promise<void>
  update(entity: PositionEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<PositionEntity | null>
  find(): Promise<Paginated<PositionEntity>>
}
