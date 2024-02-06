import { Prisma } from '@prisma/client'
import { CouriersEntity } from '../domain/couriers.entity'

export interface CouriersRepositoryPort {
  insert(entity: CouriersEntity): Promise<void>
  update(entity: CouriersEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<CouriersEntity | null>
  findMany(offset?: number, limit?: number): Promise<CouriersEntity[]>

  getCount(condition: Prisma.CouriersWhereInput): Promise<number>
}
