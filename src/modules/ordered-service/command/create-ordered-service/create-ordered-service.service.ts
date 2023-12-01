/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { PrismaService } from '../../../database/prisma.service'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { IssuedJobUpdateException, JobNotFoundException } from '../../../ordered-job/domain/job.error'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { CreateOrderedServiceCommand } from './create-ordered-service.command'
import { InvoiceNotFoundException } from '../../../invoice/domain/invoice.error'
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { OrderedProjects } from '@prisma/client'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'

@CommandHandler(CreateOrderedServiceCommand)
export class CreateOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY) private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 1. 기본가 적용
   * 2. 할인가 적용 (new service 일 때)
   * 3. 가정용은 Revision일때 Major/Minor 여부에 따라 revision base price 청구
   * 4. 상업용은 New일때 시스템 사이즈별 가격
   * 5. 상업용은 Revision일때 시간에 따라 가격 적용
   * 가격은 인보이스 청구될때 정하는걸로 하자.
   */
  async execute(command: CreateOrderedServiceCommand): Promise<AggregateID> {
    const service = await this.serviceRepo.findOne(command.serviceId)
    if (!service) throw new ServiceNotFoundException()

    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: command.jobId } })
    if (!job) throw new JobNotFoundException()

    const project = await this.prismaService.orderedProjects.findFirst({ where: { id: job.projectId } })
    if (!project) throw new ProjectNotFoundException()

    const invoiceId = job.invoiceId

    // TODO: REFACTOR
    if (invoiceId !== null) {
      const invoice = await this.prismaService.invoices.findUnique({ where: { id: invoiceId } })
      if (!invoice) throw new InvoiceNotFoundException()
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    const preOrderedServices = await this.prismaService.orderedServices.findMany({
      where: {
        projectId: job.projectId,
        serviceId: command.serviceId,
        status: { notIn: [AssignedTaskStatusEnum.Canceled, AssignedTaskStatusEnum.On_Hold] },
      },
    })

    // Start Pricing Logic
    const isRevision = !!preOrderedServices.length

    // Helper function to get project type
    const getProjectType = (project: OrderedProjects) =>
      project.projectPropertyType === 'Residential' ? 'Residential' : 'Commercial'

    // Helper function to get mounting type
    const getMountingType = (mountingType: string) => (mountingType === 'Ground Mount' ? 'Ground Mount' : 'Roof Mount')

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: project.clientOrganizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()
    if (organization.isSpecialRevisionPricing) return ''

    const projectType = getProjectType(project)
    const mountingType = getMountingType(job.mountingType)
    const systemSize = job.systemSize ? Number(job.systemSize) : null

    // Standard Pricing
    const standardPricing = service.getProps().pricing
    const standardPrice = standardPricing.getPrice(isRevision, projectType, mountingType, systemSize, null)

    // Custom Pricing TODO: Refactor (Domain Service로 만들기.)
    const customPricing = await this.customPricingRepo.findOne(null, {
      serviceId: service.id,
      organizationId: project.clientOrganizationId,
    })
    const customPrice = customPricing
      ? customPricing.getPrice(isRevision, projectType, mountingType, systemSize, null)
      : null

    // Free Revision
    const freeRevisionCount = organization.numberOfFreeRevisionCount
    const receivedFreeRevisionsCount = preOrderedServices.filter((service) => {
      return Number(service.price) === 0
    }).length
    const hasRemainingFreeRevisions = Number(freeRevisionCount) > receivedFreeRevisionsCount
    const isFreeRevision = isRevision && organization.isSpecialRevisionPricing && hasRemainingFreeRevisions

    // determine price
    const initialPrice = isFreeRevision
      ? 0
      : !!customPricing && customPricing.hasNewResidentialPricing() //
      ? customPrice
      : customPrice ?? standardPrice

    // End Pricing Logic

    const orderedService = OrderedServiceEntity.create({
      projectId: job.projectId,
      isRevision: !!preOrderedServices.length,
      sizeForRevision: null,
      price: initialPrice,
      serviceId: command.serviceId,
      jobId: command.jobId,
      description: command.description,
    })

    await this.orderedServiceRepo.insert(orderedService)
    return orderedService.id
  }
}
