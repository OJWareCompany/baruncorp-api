/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { AssignedTaskRepositoryPort } from '../../database/assigned-task.repository.port'
import { ASSIGNED_TASK_REPOSITORY } from '../../assigned-task.di-token'
import { UpdateTaskCostCommand } from './update-task-cost.command'
import { GenerateAssignedTaskModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/assignd-task-modification-history.decorator'

@CommandHandler(UpdateTaskCostCommand)
export class UpdateTaskCostService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ASSIGNED_TASK_REPOSITORY)
    private readonly assignedTaskRepo: AssignedTaskRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  @GenerateAssignedTaskModificationHistory
  async execute(command: UpdateTaskCostCommand): Promise<void> {
    const entity = await this.assignedTaskRepo.findOneOrThrow(command.assignedTaskId)
    entity.enterCostManually(command.cost)

    // TODO: Vendor Invoice로 수정

    // const job = await this.prismaService.orderedJobs.findUnique({ where: { id: entity.getProps().jobId } })
    // if (!job) throw new JobNotFoundException()
    // const invoiceId = job.invoiceId

    // if (invoiceId !== null) {
    //   const invoice = await this.prismaService.invoices.findUnique({ where: { id: invoiceId } })
    //   if (!invoice) throw new InvoiceNotFoundException()
    //   if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    // }

    await this.assignedTaskRepo.update(entity)
  }
}
