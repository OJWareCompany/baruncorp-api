/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { UpdateAssignedTaskCommand } from './update-assigned-task.command'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'

@CommandHandler(UpdateAssignedTaskCommand)
export class UpdateAssignedTaskService implements ICommandHandler {
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
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateAssignedTaskCommand): Promise<void> {
    const userEntity = await this.userRepo.findOneById(command.assigneeId)
    const assignedTaskEntity = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!assignedTaskEntity) throw new AssignedTaskNotFoundException()
    assignedTaskEntity //
      .setAssigneeId(userEntity)

    // TODO: REFACTOR
    const job = await this.jobRepo.findJobOrThrow(assignedTaskEntity.getProps().jobId)

    if (job.invoiceId !== null) {
      const invoice = await this.invoiceRepo.findOneOrThrow(job.invoiceId)
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    await this.assignedTaskRepo.update(assignedTaskEntity)
  }
}
