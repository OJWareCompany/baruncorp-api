import { Paginated } from '../../../libs/ddd/repository.port'
import { DepartmentEntity } from '../domain/department.entity'

export interface DepartmentRepositoryPort {
  insert(entity: DepartmentEntity): Promise<void>
  update(entity: DepartmentEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<DepartmentEntity | null>
  findOneOrThrow(id: string): Promise<DepartmentEntity>
  findOneByName(name: string, id?: string): Promise<DepartmentEntity | null>
  find(): Promise<Paginated<DepartmentEntity>>
}
