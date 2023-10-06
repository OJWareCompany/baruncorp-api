/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { CancelOrderedServiceCommand } from './cancel-ordered-service.command'
@CommandHandler(CancelOrderedServiceCommand)
export class CancelOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: CancelOrderedServiceCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    // TODO: REFACTOR
    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: orderedService.getProps().jobId } })
    if (!job) throw new JobNotFoundException()
    const invoiceId = job.invoiceId

    if (invoiceId !== null) {
      const invoice = await this.prismaService.invoices.findUnique({ where: { id: invoiceId } })
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    orderedService.cancel()
    await this.orderedServiceRepo.update(orderedService)
  }
}
