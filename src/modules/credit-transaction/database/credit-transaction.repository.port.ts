import { Paginated } from '../../../libs/ddd/repository.port'
import { CreditTransactionEntity } from '../domain/credit-transaction.entity'

export interface CreditTransactionRepositoryPort {
  insert(entity: CreditTransactionEntity): Promise<void>
  update(entity: CreditTransactionEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<CreditTransactionEntity | null>
  findOneOrThrow(id: string): Promise<CreditTransactionEntity>
  find(): Promise<Paginated<CreditTransactionEntity>>
}
