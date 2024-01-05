/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { AssignTaskCommand } from './assign-task.command'

@CommandHandler(AssignTaskCommand)
export class AssignTaskService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    // @ts-ignore
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
  ) {}
  async execute(command: AssignTaskCommand): Promise<void> {
    const userEntity = await this.userRepo.findOneByIdOrThrow(command.assigneeId)
    const assignedTaskEntity = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)
    const job = await this.jobRepo.findJobOrThrow(assignedTaskEntity.getProps().jobId)
    const invoice = await this.invoiceRepo.findOne(job.invoiceId || '')

    assignedTaskEntity.assign(userEntity, invoice)
    await this.assignedTaskRepo.update(assignedTaskEntity)
  }
}
