import { ScheduleEntity } from '../domain/schedule.entity'

export interface ScheduleRepositoryPort {
  upsert(entity: ScheduleEntity): Promise<void>
}
