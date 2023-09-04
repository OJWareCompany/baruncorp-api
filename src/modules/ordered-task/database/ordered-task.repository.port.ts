import { OrderedTaskEntity } from '../domain/ordered-task.entity'

export interface OrderedTaskRepositoryPort {
  insert(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void>
}
