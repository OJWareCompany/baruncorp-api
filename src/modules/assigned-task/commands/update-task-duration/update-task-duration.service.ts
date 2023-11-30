/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { AssignedTaskNotFoundException } from '../../domain/assigned-task.error'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { UpdateTaskDurationCommand } from './update-task-duration.command'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'

@CommandHandler(UpdateTaskDurationCommand)
export class UpdateTaskDurationService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateTaskDurationCommand): Promise<void> {
    const entity = await this.assignedTaskRepo.findOne(command.assignedTaskId)
    if (!entity) throw new AssignedTaskNotFoundException()
    entity //
      .setDuration(command.duration)

    // TODO: REFACTOR
    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: entity.getProps().jobId } })
    if (!job) throw new JobNotFoundException()
    const invoiceId = job.invoiceId

    if (invoiceId !== null) {
      const invoice = await this.prismaService.invoices.findUnique({ where: { id: invoiceId } })
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    await this.assignedTaskRepo.update(entity)
  }
}
