import { JobEntity } from '../domain/job.entity'

export interface JobRepositoryPort {
  insert(entity: JobEntity): Promise<void>
  update(entity: JobEntity): Promise<void>
  findJob(id: string): Promise<JobEntity>
}
