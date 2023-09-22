import { Paginated } from '../../../libs/ddd/repository.port'
import { ServiceEntity } from '../domain/service/service.entity'
import { OrderedServiceEntity } from '../domain/ordered-service/ordered-service.entity'

export interface ServiceRepositoryPort {
  insert(entity: ServiceEntity): Promise<void>
  update(entity: ServiceEntity): Promise<void>
  findOne(id: string): Promise<ServiceEntity | null>
  find(): Promise<Paginated<ServiceEntity>>
  order(entity: OrderedServiceEntity): Promise<void>
  findOrders(): Promise<Paginated<OrderedServiceEntity>>
  findOrderDetail(): Promise<OrderedServiceEntity>
}
