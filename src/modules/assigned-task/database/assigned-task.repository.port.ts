import { Paginated } from '../../../libs/ddd/repository.port'
import { AssignedTaskEntity } from '../domain/assigned-task.entity'

export interface AssignedTaskRepositoryPort {
  insert(entity: AssignedTaskEntity | AssignedTaskEntity[]): Promise<void>
  update(entity: AssignedTaskEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<AssignedTaskEntity | null>
  find(): Promise<Paginated<AssignedTaskEntity>>
}
