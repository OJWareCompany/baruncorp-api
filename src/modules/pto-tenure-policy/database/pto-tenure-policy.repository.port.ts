import { Paginated } from '../../../libs/ddd/repository.port'
import { PtoTenurePolicyEntity } from '../domain/pto-tenure-policy.entity'

export interface PtoTenurePolicyRepositoryPort {
  insert(entity: PtoTenurePolicyEntity): Promise<void>
  update(entity: PtoTenurePolicyEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<PtoTenurePolicyEntity | null>
  findMany(offset: number, limit: number): Promise<PtoTenurePolicyEntity[]>
  getCount(): Promise<number>

  getTotalOfTenure(tenure: number): Promise<number>
}
