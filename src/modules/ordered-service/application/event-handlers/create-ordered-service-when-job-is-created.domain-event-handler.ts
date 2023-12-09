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
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'
import { OrderedServiceManager } from '../../domain/ordered-service-manager.domain-service'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../../project/domain/project.type'

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
    const organization = await this.prismaService.organizations.findUnique({
      where: { id: event.organizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()
    console.log(event)
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
          event.projectId,
          event.projectType,
          event.mountingType,
          event.systemSize,
          null,
        )
        // #endregion

        const entity = OrderedServiceEntity.create({
          projectId: event.projectId,
          organizationId: event.organizationId,
          organizationName: event.organizationName,
          isRevision: await orderedServiceManager.isRevision(),
          sizeForRevision: await orderedServiceManager.getRevisionSize(),
          price: await orderedServiceManager.determineInitialPrice(),
          serviceId: orderedService.serviceId,
          serviceName: orderedService.serviceName,
          description: orderedService.description,
          jobId: event.aggregateId,
          projectPropertyType: event.projectType as ProjectPropertyTypeEnum,
          mountingType: event.mountingType as MountingTypeEnum,
        })
        console.log(entity)
        return entity
      }),
    )
    // await this.orderedServiceRepo.insert(orderedServiceEntities)
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
