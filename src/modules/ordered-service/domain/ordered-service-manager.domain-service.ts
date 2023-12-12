import { Injectable } from '@nestjs/common'
import { JobEntity } from '../../ordered-job/domain/job.entity'
import { OrganizationEntity } from '../../organization/domain/organization.entity'
import { ServiceEntity } from '../../service/domain/service.entity'
import { OrderedServiceEntity } from './ordered-service.entity'
import { OrderedServiceSizeForRevisionEnum } from './ordered-service.type'
import { CustomPricingEntity } from '../../custom-pricing/domain/custom-pricing.entity'

@Injectable()
export class ServiceInitialPriceManager {
  // 생성자인자와 메서드인자 구분을 어떻게해야할까, 클래스가 여러 조직이 사용가능한가, 조직마다 새로 생성해야하나의 여부에따라 달라질수도있다.
  determinePrice(
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
    previouslyOrderedServices: OrderedServiceEntity[],
    service: ServiceEntity,
    organization: OrganizationEntity,
    job: JobEntity,
    customPricing: CustomPricingEntity | null,
  ) {
    const isRevision = !!previouslyOrderedServices.length

    const standardPrice = service.pricing.calcPrice(
      isRevision,
      job.projectPropertyType,
      job.mountingType,
      job.systemSize,
      revisionSize,
    )

    const customPrice = customPricing
      ? customPricing.calcPrice(isRevision, job.projectPropertyType, job.mountingType, job.systemSize, revisionSize)
      : null

    const isFreeRevision =
      isRevision &&
      organization.isSpecialRevisionPricing &&
      this.hasRemainingFreeRevisions(previouslyOrderedServices, organization)

    const initialPrice = isFreeRevision
      ? 0
      : !!customPricing && customPricing.hasNewResidentialTieredPricing //
      ? customPrice
      : customPrice ?? standardPrice

    return initialPrice
  }

  isFixedPricing(service: ServiceEntity, customPricing: CustomPricingEntity | null) {
    return customPricing?.hasFixedPricing || service.pricing.fixedPrice
  }

  determineInitialRevisionSize(
    orderedService: OrderedServiceEntity,
    previouslyOrderedServices: OrderedServiceEntity[],
    organization: OrganizationEntity,
    service: ServiceEntity,
    customPricing: CustomPricingEntity | null,
  ): OrderedServiceSizeForRevisionEnum | null {
    if (orderedService.sizeForRevision) return orderedService.sizeForRevision

    // 이 로직은 애초에 OrderedServiceEntity가 preOrderedServices를 VO로서 가지고 있었어야했나?
    if (orderedService.isRevision && organization.isSpecialRevisionPricing) {
      return this.hasRemainingFreeRevisions(previouslyOrderedServices, organization)
        ? OrderedServiceSizeForRevisionEnum.Minor
        : OrderedServiceSizeForRevisionEnum.Major
    }

    const isFixedPricing = this.isFixedPricing(service, customPricing)
    if (isFixedPricing && previouslyOrderedServices.length) {
      return OrderedServiceSizeForRevisionEnum.Major
    }

    return null
  }

  private hasRemainingFreeRevisions(preOrderedServices: OrderedServiceEntity[], organization: OrganizationEntity) {
    const receivedFreeRevisionsCount = preOrderedServices.filter((service) => Number(service.price) === 0).length
    return Number(organization.numberOfFreeRevisionCount) > receivedFreeRevisionsCount
  }
}
