/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { AssignedTaskEntity } from '../assigned-task.entity'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'

@Injectable()
export class TaskStatusChangeValidationDomainService {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
  ) {}

  async validate(assignedTask: AssignedTaskEntity): Promise<void> {
    const job = await this.jobRepo.findJobOrThrow(assignedTask.getProps().jobId)
    const invoice = await this.invoiceRepo.findOne(job.invoiceId || '')
    if (invoice && invoice.isIssuedOrPaid) throw new IssuedJobUpdateException()
  }
}
