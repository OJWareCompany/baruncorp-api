import { Prisma } from '@prisma/client'
import { PtoEntity } from '../domain/pto.entity'
import { PtoTargetUser } from '../domain/value-objects/target.user.vo'
import { PtoDetailEntity } from '../domain/pto-detail.entity'

export interface PtoRepositoryPort {
  insert(entity: PtoEntity): Promise<void>
  update(entity: PtoEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<PtoEntity | null>
  findMany(condition: Prisma.PtosWhereInput, offset?: number, limit?: number): Promise<PtoEntity[]>
  findTargetUser(userId: string): Promise<PtoTargetUser>

  getCount(condition: Prisma.PtosWhereInput): Promise<number>
  findOnePtoDetail(id: string): Promise<PtoDetailEntity | null>
  deleteDetail(id: string): Promise<void>
  findPtoFromTenure(userId: string, startDateTenure: number, endDateTenure: number): Promise<PtoEntity[]>
  insertDetail(entity: PtoDetailEntity): Promise<void>
  updateDetail(entity: PtoDetailEntity): Promise<void>
  updateMany(entities: PtoEntity[]): Promise<void>
}
