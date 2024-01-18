/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { AssignedTaskEntity } from '../../../assigned-task/domain/assigned-task.entity'
import { IssuedJobUpdateException } from '../job.error'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'
import { JobEntity } from '../job.entity'
import { UserEntity } from '../../../users/domain/user.entity'

@Injectable()
export class OrderModificationValidator {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
  ) {}

  /**
   * 인보이스가 전송 되었으면 변경 불가
   * -> 잡이 전송되었으면 변경 불가되도록 수정
   */
  async validate(assignedTask: AssignedTaskEntity | OrderedServiceEntity, editor?: UserEntity): Promise<void> {
    if (editor?.canEditOrderPostInvoice) return

    const job = await this.jobRepo.findJobOrThrow(assignedTask.getProps().jobId)
    const invoice = await this.invoiceRepo.findOne(job.invoiceId || '')
    if (invoice && invoice.isIssuedOrPaid) throw new IssuedJobUpdateException()
  }

  async validateJob(job: JobEntity, editor?: UserEntity): Promise<void> {
    if (editor?.canEditOrderPostInvoice) return

    const invoice = await this.invoiceRepo.findOne(job.invoiceId || '')
    if (invoice && invoice.isIssuedOrPaid) throw new IssuedJobUpdateException()
  }
}
