import { OrderedServiceEntity } from '../domain/ordered-service.entity'
import { OrderedServiceRepositoryPort } from './ordered-service.repository.port'

export class OrderedServiceRepository implements OrderedServiceRepositoryPort {
  insert(entity: OrderedServiceEntity): Promise<string> {
    throw new Error('Method not implemented.')
  }
  findOne(id: string): Promise<OrderedServiceEntity | null> {
    throw new Error('Method not implemented.')
  }
}
