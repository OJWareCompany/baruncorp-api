/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UpdateManualPriceCommand } from './update-manual-price.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import {
  OrderedServiceInvalidRevisionSizeForManualPriceUpdateException,
  OrderedServiceNotFoundException,
} from '../../domain/ordered-service.error'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'

@CommandHandler(UpdateManualPriceCommand)
export class UpdateManualPriceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateManualPriceCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    if (orderedService.getProps().sizeForRevision !== 'Major')
      throw new OrderedServiceInvalidRevisionSizeForManualPriceUpdateException()

    const project = await this.prismaService.orderedProjects.findUnique({
      where: { id: orderedService.getProps().projectId },
    })
    if (!project) throw new ProjectNotFoundException()

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: project.clientOrganizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()

    // Free Revision
    const preOrderedServices = await this.prismaService.orderedServices.findMany({
      where: {
        projectId: project.id,
        serviceId: orderedService.getProps().serviceId,
        status: { notIn: [AssignedTaskStatusEnum.Canceled, AssignedTaskStatusEnum.On_Hold] },
      },
    })

    const freeRevisionCount = organization.numberOfFreeRevisionCount
    const receivedFreeRevisionsCount = preOrderedServices.filter((service) => {
      return Number(service.price) === 0
    }).length
    const hasRemainingFreeRevisions = Number(freeRevisionCount) > receivedFreeRevisionsCount
    const isFreeRevision =
      orderedService.getProps().isRevision && organization.isSpecialRevisionPricing && hasRemainingFreeRevisions

    if (isFreeRevision) return

    // TODO: REFACTOR
    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: orderedService.getProps().jobId } })
    if (!job) throw new JobNotFoundException()
    const invoiceId = job.invoiceId

    if (invoiceId !== null) {
      const invoice = await this.prismaService.invoices.findUnique({ where: { id: invoiceId } })
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    orderedService.setManualPrice(command.price)

    await this.orderedServiceRepo.update(orderedService)
  }
}
