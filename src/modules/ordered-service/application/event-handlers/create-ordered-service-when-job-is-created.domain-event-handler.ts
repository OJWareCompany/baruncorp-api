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
import { AssignedTaskStatusEnum } from '../../../assigned-task/domain/assigned-task.type'
import { OrganizationNotFoundException } from '../../../organization/domain/organization.error'

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

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(JobCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: JobCreatedDomainEvent) {
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
    const project = await this.prismaService.orderedProjects.findFirst({ where: { id: event.projectId } })
    if (!project) throw new ProjectNotFoundException()

    const organization = await this.prismaService.organizations.findUnique({
      where: { id: project.clientOrganizationId },
    })
    if (!organization) throw new OrganizationNotFoundException()

    const orderedServiceEntities = await Promise.all(
      event.services.map(async (orderedService) => {
        const service = await this.serviceRepo.findOne(orderedService.serviceId)
        if (!service) throw new ServiceNotFoundException()

        const preOrderedServices = await this.prismaService.orderedServices.findMany({
          where: {
            projectId: event.projectId,
            serviceId: orderedService.serviceId,
            status: { notIn: [AssignedTaskStatusEnum.Canceled, AssignedTaskStatusEnum.On_Hold] },
          },
        })

        // Start Pricing Logic
        const isRevision = !!preOrderedServices.length

        // Standard Pricing
        const standardPricing = service.getProps().pricing
        const standardPrice = standardPricing.getPrice(
          isRevision,
          event.projectType,
          event.mountingType,
          event.systemSize,
          null,
        )

        // Custom Pricing TODO: Refactor (Domain Service로 만들기.)
        const customPricing = await this.customPricingRepo.findOne(null, {
          serviceId: orderedService.serviceId,
          organizationId: project.clientOrganizationId,
        })
        const customPrice = customPricing
          ? customPricing.getPrice(isRevision, event.projectType, event.mountingType, event.systemSize, null)
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

        const entity = OrderedServiceEntity.create({
          projectId: event.projectId,
          isRevision,
          sizeForRevision:
            isFreeRevision || customPricing?.hasFixedPricing() || standardPricing.fixedPrice ? 'Major' : null, // Fixed여도 고정이어야하는데
          price: initialPrice,
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
