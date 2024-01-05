import { Injectable } from '@nestjs/common'
import { JobEntity } from '../../ordered-job/domain/job.entity'
import { OrganizationEntity } from '../../organization/domain/organization.entity'
import { ServiceEntity } from '../../service/domain/service.entity'
import { OrderedServiceEntity } from './ordered-service.entity'
import { OrderedServiceSizeForRevisionEnum } from './ordered-service.type'
import { CustomPricingEntity } from '../../custom-pricing/domain/custom-pricing.entity'
import { ProjectPropertyTypeEnum } from '../../project/domain/project.type'

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
    const isFreeRevision = this.isFreeRevision(organization, previouslyOrderedServices)
    if (isFreeRevision) return 0 // Free

    // TODO: previouslyOrderedServices에 자신이 포함되어있을것임. 추후 수정 필요. (update revision Size에서 사용하는데 이미 revision 대상이므로 상관은 없지만 로직에 모순있음)
    const isRevision = !!previouslyOrderedServices.length

    if (customPricing) {
      return customPricing.calcPrice(
        isRevision,
        job.projectPropertyType,
        job.mountingType,
        job.systemSize,
        revisionSize,
      )
    }

    // Standard Pricing
    return service.pricing.calcPrice(
      isRevision,
      job.projectPropertyType,
      job.mountingType,
      job.systemSize,
      revisionSize,
    )
  }

  isFreeRevision(organization: OrganizationEntity, previouslyOrderedServices: OrderedServiceEntity[]): boolean {
    const isRevision = !!previouslyOrderedServices.length

    return (
      isRevision &&
      organization.isSpecialRevisionPricing &&
      this.hasRemainingFreeRevisions(previouslyOrderedServices, organization)
    )
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
    if (!orderedService.isRevision || orderedService.projectPropertyType !== ProjectPropertyTypeEnum.Residential) {
      return null
    }
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
