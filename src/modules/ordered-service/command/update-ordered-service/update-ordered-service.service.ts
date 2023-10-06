/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UpdateOrderedServiceCommand } from './update-ordered-service.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'

@CommandHandler(UpdateOrderedServiceCommand)
export class UpdateOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateOrderedServiceCommand): Promise<void> {
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

    const project = await this.prismaService.orderedProjects.findUnique({
      where: { id: orderedService.getProps().projectId },
    })
    if (!project) throw new ProjectNotFoundException()

    orderedService.setPriceOverride(command.priceOverride)
    orderedService.setDescription(command.description)
    orderedService.setTaskSizeForRevision(command.sizeForRevision)
    await this.orderedServiceRepo.update(orderedService)
  }
}
