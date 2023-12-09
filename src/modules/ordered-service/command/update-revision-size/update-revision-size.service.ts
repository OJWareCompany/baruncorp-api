/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../database/prisma.service'
import { UpdateRevisionSizeCommand as UpdateRevisionSizeCommand } from './update-revision-size.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { OrderedServiceManager } from '../../domain/ordered-service-manager.domain-service'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

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
    // #region Validation
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    const isRevision = orderedService.getProps().isRevision
    if (!isRevision) return

    const service = await this.serviceRepo.findOne(orderedService.getProps().serviceId)
    if (!service) throw new ServiceNotFoundException()

    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: orderedService.getProps().jobId } })
    if (!job) throw new JobNotFoundException()
    if (job.invoiceId !== null) {
      const invoice = await this.prismaService.invoices.findUnique({ where: { id: job.invoiceId } })
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    const project = await this.prismaService.orderedProjects.findUnique({ where: { id: job.projectId } })
    if (!project) throw new ProjectNotFoundException()

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: project.clientOrganizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()
    if (organization.isSpecialRevisionPricing) return

    // #endregion

    orderedService.setTaskSizeForRevision(command.revisionSize)

    const orderedServiceManager = new OrderedServiceManager(
      this.prismaService,
      service,
      this.customPricingRepo,
      organization,
      project.id,
      project.projectPropertyType as ProjectPropertyTypeEnum,
      job.mountingType as MountingTypeEnum,
      job.systemSize ? Number(job.systemSize) : null,
      orderedService,
    )

    if (await orderedServiceManager.isFixedPricing()) return

    const updatePrice = await orderedServiceManager.determineInitialPrice()
    orderedService.setPrice(updatePrice)
    await this.orderedServiceRepo.update(orderedService)
  }
}
