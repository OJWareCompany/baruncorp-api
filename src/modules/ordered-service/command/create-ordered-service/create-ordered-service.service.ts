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
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { OrderedServiceManager } from '../../application/event-handlers/determine-initial-price.domain-service'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

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
    // #region validation
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

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: project.clientOrganizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()
    // #endregion validation

    const orderedServiceManager = new OrderedServiceManager(
      this.prismaService,
      service,
      this.customPricingRepo,
      organization,
      project.id,
      project.projectPropertyType as ProjectPropertyTypeEnum,
      job.mountingType as MountingTypeEnum,
      job.systemSize ? Number(job.systemSize) : null,
      null,
    )

    const orderedService = OrderedServiceEntity.create({
      projectId: job.projectId,
      jobId: command.jobId,
      isRevision: await orderedServiceManager.isRevision(),
      sizeForRevision: await orderedServiceManager.getRevisionSize(),
      price: await orderedServiceManager.determineInitialPrice(),
      serviceId: command.serviceId,
      serviceName: service.getProps().name,
      description: command.description,
      projectPropertyType: job.projectType as ProjectPropertyTypeEnum,
      mountingType: job.mountingType as MountingTypeEnum,
      organizationId: job.clientOrganizationId,
      organizationName: job.clientOrganizationName,
    })

    await this.orderedServiceRepo.insert(orderedService)
    return orderedService.id
  }
}
