import { UserEntity } from '../../users/domain/user.entity'
import { JobEntity } from '../domain/job.entity'
import { OrderedJobs } from '@prisma/client'

export interface JobRepositoryPort {
  insert(entity: JobEntity | JobEntity[]): Promise<void>
  update(entity: JobEntity | JobEntity[]): Promise<void>
  findJobOrThrow(id: string): Promise<JobEntity>
  findManyBy(property: keyof OrderedJobs, value: OrderedJobs[typeof property]): Promise<JobEntity[]>
  findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<JobEntity[]>
  getTotalInvoiceAmount(jobId: string): Promise<number>
  getSubtotalInvoiceAmount(jobId: string): Promise<number>
  rollbackUpdatedAtAndEditor(entity: JobEntity): Promise<void>
  updateOnlyEditorInfo(entity: JobEntity, editor: UserEntity): Promise<void>
}
