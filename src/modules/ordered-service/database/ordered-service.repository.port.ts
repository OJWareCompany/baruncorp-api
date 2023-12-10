import { OrderedServices } from '@prisma/client'
import { OrderedServiceEntity } from '../domain/ordered-service.entity'

export interface OrderedServiceRepositoryPort {
  insert(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void>
  findOne(id: string): Promise<OrderedServiceEntity | null>
  findOneOrThrow(id: string): Promise<OrderedServiceEntity>
  find(ids: string[]): Promise<OrderedServiceEntity[] | null>
  findBy(
    propertyName: keyof OrderedServices,
    values: OrderedServices[typeof propertyName][],
  ): Promise<OrderedServiceEntity[]>
  update(entity: OrderedServiceEntity | OrderedServiceEntity[]): Promise<void>
  delete(id: string): Promise<void>
  getPreviouslyOrderedServices(projectId: string, serviceId: string): Promise<OrderedServiceEntity[]>
}
