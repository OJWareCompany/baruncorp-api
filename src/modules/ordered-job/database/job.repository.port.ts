import { JobEntity } from '../domain/job.entity'
import { OrderedProjects, Users } from '@prisma/client'

export interface JobRepositoryPort {
  insert(entity: JobEntity): Promise<void>
  update(entity: JobEntity): Promise<void>
  findJob(id: string): Promise<JobEntity>
  findUser(userId: string): Promise<Users>
  findProject(projectId: string): Promise<OrderedProjects>
}
