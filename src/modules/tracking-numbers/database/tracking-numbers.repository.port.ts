import { Prisma } from '@prisma/client'
import { TrackingNumbersEntity } from '../domain/tracking-numbers.entity'

export interface TrackingNumbersRepositoryPort {
  insert(entity: TrackingNumbersEntity): Promise<void>
  update(entity: TrackingNumbersEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<TrackingNumbersEntity | null>
  findMany(offset?: number, limit?: number): Promise<TrackingNumbersEntity[]>

  getCount(): Promise<number>
}
