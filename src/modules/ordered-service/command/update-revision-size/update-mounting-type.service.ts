/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UpdateRevisionSizeCommand as UpdateRevisionSizeCommand } from './update-mounting-type.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { OrderedProjects } from '@prisma/client'

@CommandHandler(UpdateRevisionSizeCommand)
export class UpdateRevisionSizeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}
  async execute(command: UpdateRevisionSizeCommand): Promise<void> {
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

    // Start Pricing Logic
    // Helper function to get project type
    const getProjectType = (project: OrderedProjects) =>
      project.projectPropertyType === 'Residential' ? 'Residential' : 'Commercial'

    // Helper function to get mounting type
    const getMountingType = (mountingType: string) => (mountingType === 'Ground Mount' ? 'Ground Mount' : 'Roof Mount')

    const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.projectId } })
    if (!project) throw new ProjectNotFoundException()

    const isRevision = orderedService.getProps().isRevision
    const projectType = getProjectType(project)
    const mountingType = getMountingType(job.mountingType)
    const systemSize = job.systemSize ? Number(job.systemSize) : null

    // Get standard service pricing
    const service = await this.serviceRepo.findOne(orderedService.getProps().serviceId)
    if (!service) throw new ServiceNotFoundException()
    const standardPrice = service.getProps().pricing.getPrice(isRevision, projectType, mountingType, systemSize, null)

    // Get custom pricing if available
    const customPricing = await this.customPricingRepo.findOne(null, {
      serviceId: orderedService.getProps().serviceId,
      organizationId: project.clientOrganizationId,
    })
    const customPrice = customPricing
      ? customPricing.getPrice(
          isRevision,
          projectType,
          mountingType,
          systemSize,
          orderedService.getProps().sizeForRevision,
        )
      : null
    // Determine final price
    const updatePrice = customPrice ?? standardPrice

    // End Pricing Logic
    orderedService.setPrice(updatePrice)
    orderedService.setTaskSizeForRevision(command.revisionSize)

    await this.orderedServiceRepo.update(orderedService)
  }
}
