import { Paginated } from '../../../libs/ddd/repository.port'
import { IntegratedOrderModificationHistoryEntity } from '../domain/integrated-order-modification-history.entity'

export interface IntegratedOrderModificationHistoryRepositoryPort {
  find(): Promise<Paginated<IntegratedOrderModificationHistoryEntity>>
}
