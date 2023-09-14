import { JobEntity } from '../domain/job.entity'
import { OrderedProjects, Users } from '@prisma/client'

export interface JobRepositoryPort {
  insert(entity: JobEntity): Promise<void>
  update(entity: JobEntity): Promise<void>
  findJobOrThrow(id: string): Promise<JobEntity>
  findUser(userId: string): Promise<Users | null>
  findProject(projectId: string): Promise<OrderedProjects | null>
}
