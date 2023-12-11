import { Paginated } from '../../../libs/ddd/repository.port'
import { ExpensePricingEntity } from '../domain/expense-pricing.entity'

export interface ExpensePricingRepositoryPort {
  insert(entity: ExpensePricingEntity): Promise<void>
  update(entity: ExpensePricingEntity): Promise<void>
  delete(organizationId: string, taskId: string): Promise<void>
  findOne(organizationId: string, taskId: string): Promise<ExpensePricingEntity | null>
  findOneOrThrow(organizationId: string, taskId: string): Promise<ExpensePricingEntity>
  find(): Promise<Paginated<ExpensePricingEntity>>
}
