import { Prisma } from '@prisma/client'
import { JobEntity } from '../domain/job.entity'
import { UserEntity } from '../../users/domain/user.entity'

export interface JobRepositoryPort {
  insert(entity: JobEntity | JobEntity[]): Promise<void>
  update(entity: JobEntity | JobEntity[]): Promise<void>
  delete(entity: JobEntity | JobEntity[]): Promise<void>
  findJobOrThrow(id: string): Promise<JobEntity>
  findManyBy(whereInput: Prisma.OrderedJobsWhereInput): Promise<JobEntity[]>
  findJobsToInvoice(clientOrganizationId: string, serviceMonth: Date): Promise<JobEntity[]>
  getTotalInvoiceAmount(jobId: string): Promise<number>
  getSubtotalInvoiceAmount(jobId: string): Promise<number>
  rollbackUpdatedAtAndEditor(entity: JobEntity): Promise<void>
  updateOnlyEditorInfo(entity: JobEntity, editor?: UserEntity): Promise<void>
  isExist(id: string): Promise<boolean>
}
