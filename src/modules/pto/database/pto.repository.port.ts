import { Prisma } from '@prisma/client'
import { Paginated } from '../../../libs/ddd/repository.port'
import { PtoEntity } from '../domain/pto.entity'
import { PtoTargetUser } from '../domain/value-objects/target.user.vo'

export interface PtoRepositoryPort {
  insert(entity: PtoEntity): Promise<void>
  update(entity: PtoEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<PtoEntity | null>
  findMany(condition: Prisma.PtosWhereInput, offset: number, limit: number): Promise<PtoEntity[]>
  findTargetUser(userId: string): Promise<PtoTargetUser>

  getCount(condition: Prisma.PtosWhereInput): Promise<number>
}
