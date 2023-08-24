import { OrderedTaskEntity } from '../domain/ordered-task.entity'

export interface OrderedTaskRepositoryPort {
  insert(entity: OrderedTaskEntity): Promise<void>
}
