import { OrderedServiceEntity } from '../domain/ordered-service.entity'

export interface OrderedServiceRepositoryPort {
  insert(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void>
  findOne(id: string): Promise<OrderedServiceEntity | null>
  update(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void>
  delete(id: string): Promise<void>
}
