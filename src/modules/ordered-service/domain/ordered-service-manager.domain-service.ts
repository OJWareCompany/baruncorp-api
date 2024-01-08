/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OrganizationEntity } from '../../organization/domain/organization.entity'
import { OrderedServiceEntity } from './ordered-service.entity'
import { OrderedServiceSizeForRevisionEnum } from './ordered-service.type'
import { ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing/custom-pricing.di-token'
import { CustomPricingRepositoryPort } from '../../custom-pricing/database/custom-pricing.repository.port'
import { ServiceRepositoryPort } from '../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../service/service.di-token'
import { OrganizationRepositoryPort } from '../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../organization/organization.di-token'
import { JobRepositoryPort } from '../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../ordered-job/job.di-token'
import { OrderedServiceRepositoryPort } from '../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../ordered-service.di-token'

@Injectable()
export class ServiceInitialPriceManager {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort, // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY) private readonly customPricingRepo: CustomPricingRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort, // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}

  /**
   * 생성자인자와 메서드인자 구분을 어떻게해야할까, 클래스가 여러 조직이 사용가능한가, 조직마다 새로 생성해야하나의 여부에따라 달라질수도있다.
   * 240107) 구분 기준
   * 1. 도메인 서비스에서만 쓰이는 인수라면 생성자에 선언한다.
   * 이유: 1. 도메인 서비스때문에 응용 서비스에 불필요하게 의존성을 추가하게 되고 테스트가 불편해진다.
   *      2. 도메인 서비스 객체 생성을 IoC에게 위임하는 것이 NestJS 200% 활용 방법 (이유는 아니고 그냥 메모)
   */
  async determinePrice(orderedService: OrderedServiceEntity, revisionSize: OrderedServiceSizeForRevisionEnum | null) {
    // TODO: previouslyOrderedServices에 자신이 포함되어있을것임. 추후 수정 필요. (update revision Size에서 사용하는데 이미 revision 대상이므로 상관은 없지만 로직에 모순있음)
    // 새로운 스코프가 주문되기 전이라 자신이 포함되지 않음
    const isFreeRevision = await this.isFreeRevision(orderedService)
    if (isFreeRevision) return 0 // Free

    const job = await this.jobRepo.findJobOrThrow(orderedService.jobId)

    const customPricing = await this.customPricingRepo.findOne(orderedService.organizationId, orderedService.serviceId)
    if (customPricing) {
      return customPricing.calcPrice(
        orderedService.isRevision,
        job.projectPropertyType,
        job.mountingType,
        job.systemSize,
        revisionSize,
      )
    }

    const service = await this.serviceRepo.findOneOrThrow(orderedService.serviceId)
    // Standard Pricing
    return service.pricing.calcPrice(
      orderedService.isRevision,
      job.projectPropertyType,
      job.mountingType,
      job.systemSize,
      revisionSize,
    )
  }

  async isFreeRevision(orderedService: OrderedServiceEntity): Promise<boolean> {
    const organization = await this.organizationRepo.findOneOrThrow(orderedService.organizationId)

    return (
      orderedService.isRevision &&
      organization.isSpecialRevisionPricing &&
      (await this.hasRemainingFreeRevisions(orderedService, organization))
    )
  }

  async determineInitialRevisionSize(
    orderedService: OrderedServiceEntity,
  ): Promise<OrderedServiceSizeForRevisionEnum | null> {
    const organization = await this.organizationRepo.findOneOrThrow(orderedService.organizationId)

    if (!orderedService.isRevision || orderedService.projectPropertyType !== ProjectPropertyTypeEnum.Residential) {
      return null
    }

    if (orderedService.sizeForRevision) return orderedService.sizeForRevision

    // 이 로직은 애초에 OrderedServiceEntity가 preOrderedServices를 VO로서 가지고 있었어야했나?
    if (orderedService.isRevision && organization.isSpecialRevisionPricing) {
      return (await this.hasRemainingFreeRevisions(orderedService, organization))
        ? OrderedServiceSizeForRevisionEnum.Minor
        : OrderedServiceSizeForRevisionEnum.Major
    }

    const isFixedPricing = await this.isFixedPricing(orderedService)
    if (isFixedPricing && orderedService.isRevision) {
      return OrderedServiceSizeForRevisionEnum.Major
    }

    return null
  }

  private async hasRemainingFreeRevisions(orderedService: OrderedServiceEntity, organization: OrganizationEntity) {
    const preOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
      orderedService.projectId,
      orderedService.serviceId,
    )
    const receivedFreeRevisionsCount = preOrderedServices.filter((service) => Number(service.price) === 0).length
    return Number(organization.numberOfFreeRevisionCount) > receivedFreeRevisionsCount
  }

  async isFixedPricing(orderedService: OrderedServiceEntity) {
    const customPricing = await this.customPricingRepo.findOne(orderedService.organizationId, orderedService.serviceId)
    const service = await this.serviceRepo.findOneOrThrow(orderedService.serviceId)

    return customPricing?.hasFixedPricing || service.pricing.fixedPrice
  }
}
