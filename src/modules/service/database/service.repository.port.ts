import { ServiceEntity } from '../domain/service/service.entity'

export interface ServiceRepositoryPort {
  insert(entity: ServiceEntity): Promise<void>
}
