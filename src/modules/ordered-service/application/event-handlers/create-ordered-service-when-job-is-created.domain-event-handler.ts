/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JobCreatedDomainEvent } from '../../../ordered-job/domain/events/job-created.domain-event'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'

@Injectable()
export class CreateOrderedServiceWhenJobIsCreatedEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY) private readonly customPricingRepo: CustomPricingRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
  ) {}

  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
    const organization = await this.organizationRepo.findOneOrThrow(event.organizationId)
    const job = await this.jobRepo.findJobOrThrow(event.aggregateId)
    const project = await this.projectRepo.findProjectOrThrow(job.projectId)

    const makeEntities = event.services.map(async (orderedService) => {
      const service = await this.serviceRepo.findOneOrThrow(orderedService.serviceId)

      // 새로운 스코프가 주문되기 전이라 자신이 포함되지 않음
      const previouslyOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
        event.projectId,
        orderedService.serviceId,
      )

      const orderedServiceEntity = OrderedServiceEntity.create({
        projectId: event.projectId,
        jobId: event.aggregateId,
        isRevision: !!previouslyOrderedServices.length,
        serviceId: orderedService.serviceId,
        serviceName: orderedService.serviceName,
        description: orderedService.description,
        projectPropertyType: event.projectType as ProjectPropertyTypeEnum,
        mountingType: event.mountingType as MountingTypeEnum,
        organizationId: event.organizationId,
        organizationName: event.organizationName,
        projectNumber: project.projectNumber,
        projectPropertyOwnerName: project.projectPropertyOwnerName,
        jobName: job.jobName,
        isExpedited: job.getProps().isExpedited,
      })

      const customPricing = await this.customPricingRepo.findOne(organization.id, service.id)

      orderedServiceEntity.determineInitialValues(
        this.serviceInitialPriceManager,
        service,
        organization,
        job,
        previouslyOrderedServices,
        customPricing,
      )
      return orderedServiceEntity
    })

    const orderedServiceEntities = await Promise.all(makeEntities)

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

/**
 * NOTE:
 * 이벤트로 처리하면 확실히 종속성을 많이 줄일수 있음, 보내는 측에서 유효성 검사를 하고 보낼수 있으니까,
 * 근데 Request API로 만들어야하는 것은 여전히 유효성 검사를 위해서 다른 Aggregate를 조회해야함.
 *
 * NOTE:
 * 데이터 변경은 Aggregate에서 이루어져야 하는 이유
 * 1. 변경된 데이터가 다른 데이터에 영향을 받을 수 있다. 관련된 데이터를 합쳐놓은 것이 Aggregate.
 * 2. 도메인 이벤트로 변경사항을 관리하기 쉬워진다. (중복된 데이터를 가진 Aggregate가 해당 이벤트를 구독함으로서)
 */
