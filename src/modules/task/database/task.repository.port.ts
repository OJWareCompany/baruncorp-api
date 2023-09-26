import { Paginated } from '../../../libs/ddd/repository.port'
import { TaskEntity } from '../domain/task.entity'

export interface TaskRepositoryPort {
  insert(entity: TaskEntity): Promise<void>
  update(entity: TaskEntity): Promise<void>
  delete(id: string): Promise<void>
  findOne(id: string): Promise<TaskEntity | null>
  find(): Promise<Paginated<TaskEntity>>
}
