import { OrderedServiceEntity } from '../domain/ordered-service.entity'

export interface OrderedServiceRepositoryPort {
  insert(entity: OrderedServiceEntity): Promise<void>
  findOne(id: string): Promise<OrderedServiceEntity | null>
  // find(): Promise<OrderedServiceEntity[]>
}
