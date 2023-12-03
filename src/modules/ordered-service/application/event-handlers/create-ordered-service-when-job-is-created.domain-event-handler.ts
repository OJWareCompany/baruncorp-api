/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../../database/prisma.service'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { ServiceNotFoundException } from '../../../service/domain/service.error'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { ProjectNotFoundException } from '../../../project/domain/project.error'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { OrderedServiceManager } from './determine-initial-price.domain-service'
import { JobNotFoundException } from '../../../ordered-job/domain/job.error'

@Injectable()
export class CreateOrderedServiceWhenJobIsCreatedEventHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY) private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly prismaService: PrismaService,
  ) {}

  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const project = await this.prismaService.orderedProjects.findFirst({ where: { id: event.projectId } })
    if (!project) throw new ProjectNotFoundException()
    const job = await this.prismaService.orderedJobs.findUnique({ where: { id: event.aggregateId } })
    console.log(job)
    if (!job) throw new JobNotFoundException()

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: project.clientOrganizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()

    const orderedServiceEntities = await Promise.all(
      event.services.map(async (orderedService) => {
        // #region get ordered service manager
        const service = await this.serviceRepo.findOne(orderedService.serviceId)
        if (!service) throw new ServiceNotFoundException()

        const orderedServiceManager = new OrderedServiceManager(
          this.prismaService,
          service,
          this.customPricingRepo,
          organization,
          project,
          job,
          null,
        )
        // #endregion

        const entity = OrderedServiceEntity.create({
          projectId: event.projectId,
          isRevision: await orderedServiceManager.isRevision(),
          sizeForRevision: await orderedServiceManager.getRevisionSize(), // Fixed여도 고정이어야하는데
          price: await orderedServiceManager.determineInitialPrice(),
          serviceId: orderedService.serviceId,
          description: orderedService.description,
          jobId: event.aggregateId,
        })
        return entity
      }),
    )
    await this.orderedServiceRepo.insert(orderedServiceEntities)
  }
}

// New Residential (Fixed / 0)
// Residential Revision (Size, Mounting Type)
//    - Free Revision
// New Commercial Tier (System Size, Mounting Type)
// Commercial Revision X
// Fixed Price

/**
 * 가격 수정시 매뉴얼리 표시 필요함. 인보이스할때 매뉴얼리는 고정됨
 */

/**
 * isFixed?
 *  return price
 *
 * isRevision?
 *  return null -> price is when it turns out it's gm
 *          or Free Revision? Yes -> Done? -> input price
 *
 * new zone
 *
 * is Commercial?
 *  return null
 *
 * isResidential?
 *  return isFixed? -> price or null
 *
 * commercial Zone
 *  return match tier! OR 0
 */
