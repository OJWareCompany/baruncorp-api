import { PaginatedQueryBase } from '../../../libs/ddd/query.base'
import { Paginated } from '../../../libs/ddd/repository.port'
import { AssignedTaskEntity } from '../domain/assigned-task.entity'

export interface AssignedTaskRepositoryPort {
  insert(entity: AssignedTaskEntity | AssignedTaskEntity[]): Promise<void>
  update(entity: AssignedTaskEntity | AssignedTaskEntity[]): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<AssignedTaskEntity | null>
  findOneOrThrow(id: string): Promise<AssignedTaskEntity>
  find(): Promise<Paginated<AssignedTaskEntity>>
  findToVendorInvoice(
    organizationId: string,
    serviceMonth: Date,
    query?: PaginatedQueryBase,
  ): Promise<AssignedTaskEntity[]>
}
