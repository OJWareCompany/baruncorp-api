import { OrderedTaskEntity } from '../domain/ordered-task.entity'

export interface OrderedTaskRepositoryPort {
  findById(id: string): Promise<OrderedTaskEntity>
  findByJobId(jobId: string): Promise<OrderedTaskEntity[]>
  insert(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void>
  update(entity: OrderedTaskEntity | OrderedTaskEntity[]): Promise<void>
}
