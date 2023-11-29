import { Paginated } from '../../../libs/ddd/repository.port'
import { CustomPricingEntity } from '../domain/custom-pricing.entity'

export interface CustomPricingRepositoryPort {
  insert(entity: CustomPricingEntity): Promise<void>
  update(entity: CustomPricingEntity): Promise<void>
  delete(id: CustomPricingEntity): Promise<void>
  findOne(id: string | null, where?: { serviceId: string; organizationId: string }): Promise<CustomPricingEntity | null>
  find(): Promise<Paginated<CustomPricingEntity>>
}
