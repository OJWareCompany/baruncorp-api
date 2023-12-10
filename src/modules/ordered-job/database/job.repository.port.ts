import { JobEntity } from '../domain/job.entity'
import { OrderedJobs, OrderedProjects, Users } from '@prisma/client'

export interface JobRepositoryPort {
  insert(entity: JobEntity | JobEntity[]): Promise<void>
  update(entity: JobEntity | JobEntity[]): Promise<void>
  findJobOrThrow(id: string): Promise<JobEntity>
  findManyBy(property: keyof OrderedJobs, value: OrderedJobs[typeof property]): Promise<JobEntity[]>
  findUser(userId: string): Promise<Users | null>
  findProject(projectId: string): Promise<OrderedProjects | null>
  findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<JobEntity[]>
}
