import { OrderedTaskEntity } from '../domain/ordered-task.entity'

export interface OrderedTaskRepositoryPort {
  findById(id: string): Promise<OrderedTaskEntity>
  findAssociatedTasks(entity: OrderedTaskEntity): Promise<OrderedTaskEntity[]>
  insert(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void>
  update(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void>
}
