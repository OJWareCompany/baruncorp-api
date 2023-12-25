import { AssigningTaskAlertEntity } from '../domain/assigning-task-alert.entity'

export interface AssigningTaskAlertRepositoryPort {
  create(entity: AssigningTaskAlertEntity): Promise<void>
  findOne(id: string): Promise<AssigningTaskAlertEntity | null>
  findOneOrThrow(id: string): Promise<AssigningTaskAlertEntity>
  update(entity: AssigningTaskAlertEntity): Promise<void>
}
