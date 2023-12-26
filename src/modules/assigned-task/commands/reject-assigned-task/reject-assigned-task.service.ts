/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { USER_REPOSITORY } from '../../../users/user.di-tokens'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { UserRepositoryPort } from '../../../users/database/user.repository.port'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { RejectAssignedTaskCommand } from './reject-assigned-task.command'
import { AssignedTaskAlreadyCompletedException, AssigneeNotFoundException } from '../../domain/assigned-task.error'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { v4 } from 'uuid'

@CommandHandler(RejectAssignedTaskCommand)
export class RejectAssignedTaskService implements ICommandHandler {
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
  async execute(command: RejectAssignedTaskCommand): Promise<void> {
    const assignedTask = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)
    if (assignedTask.isCompleted) throw new AssignedTaskAlreadyCompletedException()

    const assigneeId = assignedTask.getProps().assigneeId
    if (!assigneeId) {
      throw new AssigneeNotFoundException()
    }

    const user = await this.userRepo.findOneByIdOrThrow(assigneeId)

    const job = await this.jobRepo.findJobOrThrow(assignedTask.getProps().jobId)

    if (job.invoiceId !== null) {
      const invoice = await this.invoiceRepo.findOneOrThrow(job.invoiceId)
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    assignedTask.unassign()
    await this.assignedTaskRepo.update(assignedTask)
    await this.prismaService.rejectedTaskReasons.create({
      data: {
        id: v4(),
        assigneeUserId: user.id,
        assigneeUserName: user.getProps().userName.getFullName(),
        reason: command.reason,
        taskName: assignedTask.getProps().taskName,
        assignedTaskId: command.assignedTaskId,
        rejectedAt: new Date(),
      },
    })
  }
}
