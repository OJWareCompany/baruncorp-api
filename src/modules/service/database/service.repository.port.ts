import { ServiceEntity } from '../domain/service.entity'

export interface ServiceRepositoryPort {
  insert(entity: ServiceEntity): Promise<{ id: string }>
}
