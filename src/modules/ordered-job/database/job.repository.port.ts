import { JobEntity } from '../domain/job.entity'

export interface JobRepositoryPort {
  insert(entity: JobEntity): Promise<void>
}
