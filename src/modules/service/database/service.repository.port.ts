import { Prisma } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import { ServiceEntity } from '../domain/service.entity'

export interface ServiceRepositoryPort {
  insert(entity: ServiceEntity): Promise<void>
  update(entity: ServiceEntity): Promise<void>
  delete(entity: ServiceEntity): Promise<void>
  findOne(id: string): Promise<ServiceEntity | null>
  findOneOrThrow(id: string): Promise<ServiceEntity>
  find(whereInput: Prisma.ServiceWhereInput): Promise<ServiceEntity[]>
}
