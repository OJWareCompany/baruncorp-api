/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OrderedServices } from '@prisma/client'
import { CalcPriceAndPricingReturnType } from '../../custom-pricing/domain/custom-pricing.type'
import { CustomPricingRepositoryPort } from '../../custom-pricing/database/custom-pricing.repository.port'
import { OrganizationRepositoryPort } from '../../organization/database/organization.repository.port'
import { CUSTOM_PRICING_REPOSITORY } from '../../custom-pricing/custom-pricing.di-token'
import { MountingTypeEnum, ProjectPropertyTypeEnum } from '../../project/domain/project.type'
import { ORGANIZATION_REPOSITORY } from '../../organization/organization.di-token'
import { ServiceRepositoryPort } from '../../service/database/service.repository.port'
import { OrganizationEntity } from '../../organization/domain/organization.entity'
import { SERVICE_REPOSITORY } from '../../service/service.di-token'
import { JobRepositoryPort } from '../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../ordered-job/job.di-token'
import { OrderedServicePricingTypeEnum, OrderedServiceSizeForRevisionEnum } from './ordered-service.type'
import { OrderedServiceRepositoryPort } from '../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../ordered-service.di-token'
import { OrderedServiceEntity } from './ordered-service.entity'
import { Pricing } from '../../service/domain/value-objects/pricing.value-object'
import { CustomPricingEntity } from '../../custom-pricing/domain/custom-pricing.entity'
import { CustomPricingTypeEnum } from '../../custom-pricing/commands/create-custom-pricing/create-custom-pricing.command'
import { ValidScopeStatus } from './value-objects/valid-previously-scope-status.value-object'

/**
 * 코드가 너무 커졌다, 명확하게 책임에 따라 코드를 분리하자
 */
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
   *
   * 인프라는 생성자에
   * 메서드의 대상이 되는 도메인 객체는 메서드의 인자에
   */
  async determinePriceAndPricingType(
    orderedService: OrderedServiceEntity,
    revisionSize: OrderedServiceSizeForRevisionEnum | null,
  ): Promise<CalcPriceAndPricingReturnType | null> {
    // TODO: previouslyOrderedServices에 자신이 포함되어있을것임. 추후 수정 필요. (update revision Size에서 사용하는데 이미 revision 대상이므로 상관은 없지만 로직에 모순있음)
    // 새로운 스코프가 주문되기 전이라 자신이 포함되지 않음
    const isFreeRevision = await this.isFreeRevision(orderedService)
    if (isFreeRevision) {
      return {
        price: 0,
        pricingType: OrderedServicePricingTypeEnum.CUSTOM_SPECIAL_REVISION_FREE,
      }
    }
    const job = await this.jobRepo.findJobOrThrow(orderedService.jobId)

    // TODO: Pricing Type을 명확하게 판별해주는 코드 필요.
    const customPricing = await this.customPricingRepo.findOne(orderedService.organizationId, orderedService.serviceId)

    const customPrice = customPricing
      ? customPricing.calcPriceAndPricingType(
          orderedService.isRevision,
          job.projectPropertyType,
          job.mountingType,
          job.systemSize,
          revisionSize,
        )
      : null

    const service = await this.serviceRepo.findOneOrThrow(orderedService.serviceId)
    // Standard Pricing
    const standardPrice = service.pricing.calcPriceAndPricingType(
      orderedService.isRevision,
      job.projectPropertyType,
      job.mountingType,
      job.systemSize,
      revisionSize,
    )
    return customPrice || standardPrice
  }

  async isFreeRevision(orderedService: OrderedServiceEntity | OrderedServices): Promise<boolean> {
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

  private async hasRemainingFreeRevisions(
    orderedService: OrderedServiceEntity | OrderedServices,
    organization: OrganizationEntity,
  ) {
    const preOrderedServices = await this.orderedServiceRepo.findPreviousSameScopesInProject(
      orderedService.projectId,
      orderedService.serviceId,
      orderedService.orderedAt,
      new ValidScopeStatus(),
    )
    const receivedFreeRevisionsCount = preOrderedServices.filter((service) => Number(service.price) === 0).length
    return Number(organization.numberOfFreeRevisionCount) > receivedFreeRevisionsCount
  }

  async isFixedPricing(orderedService: OrderedServiceEntity) {
    const customPricing = await this.customPricingRepo.findOne(orderedService.organizationId, orderedService.serviceId)
    const service = await this.serviceRepo.findOneOrThrow(orderedService.serviceId)

    return customPricing?.hasFixedPricing || service.pricing.fixedPrice
  }

  // private async checkFreeRevisionType(
  //   orderedService: OrderedServiceEntity | OrderedServices,
  //   organization: OrganizationEntity,
  //   isRevision: boolean,
  // ): Promise<OrderedServicePricingTypeEnum | null> {
  //   const isFreeRevision = await this.isFreeRevision(orderedService)
  //   if (isFreeRevision) return OrderedServicePricingTypeEnum.CUSTOM_SPECIAL_REVISION_FREE // ?

  //   if (isRevision && organization.isSpecialRevisionPricing)
  //     return OrderedServicePricingTypeEnum.CUSTOM_SPECIAL_REVISION_PRICE // ?
  //   return null
  // }

  // async determinePricingType(
  //   orderedService: OrderedServiceEntity | OrderedServices,
  // ): Promise<OrderedServicePricingTypeEnum> {
  //   const job = await this.jobRepo.findJobOrThrow(orderedService.jobId)
  //   const projectType = job.projectPropertyType
  //   const mountingType = job.mountingType
  //   const isRevision = orderedService.isRevision
  //   const customPricing = await this.customPricingRepo.findOne(orderedService.organizationId, orderedService.serviceId)
  //   const service = await this.serviceRepo.findOneOrThrow(orderedService.serviceId)
  //   const organization = await this.organizationRepo.findOneOrThrow(orderedService.organizationId)

  //   const freeRevisionType = await this.checkFreeRevisionType(orderedService, organization, isRevision)

  //   const result = this.determinePricingTypeFor(isRevision, projectType, mountingType, customPricing || service.pricing)
  //   return freeRevisionType || result || OrderedServicePricingTypeEnum.NO_PRICING_TYPE
  // }

  // private determinePricingTypeFor(
  //   isRevision: boolean,
  //   projectType: ProjectPropertyTypeEnum,
  //   mountingType: MountingTypeEnum,
  //   pricing: Pricing | CustomPricingEntity,
  // ): OrderedServicePricingTypeEnum | null {
  //   const pricingType = this.determineNoneFixedPricingType(isRevision, projectType, mountingType, pricing)
  //   const fixedPricingType = this.determineFixedPricingType(pricing)
  //   if (pricingType) return pricingType
  //   if (fixedPricingType) return fixedPricingType
  //   return null
  // }

  // private determineFixedPricingType(pricing: Pricing | CustomPricingEntity): OrderedServicePricingTypeEnum | null {
  //   return pricing instanceof Pricing && pricing.fixedPrice
  //     ? OrderedServicePricingTypeEnum.BASE_FIXED_PRICE
  //     : pricing instanceof CustomPricingEntity && pricing.customPricingType === CustomPricingTypeEnum.custom_fixed
  //     ? OrderedServicePricingTypeEnum.CUSTOM_FIXED_PRICE
  //     : null
  // }

  // private determineNoneFixedPricingType(
  //   isRevision: boolean,
  //   projectType: ProjectPropertyTypeEnum,
  //   mountingType: MountingTypeEnum,
  //   pricing: Pricing | CustomPricingEntity,
  // ): OrderedServicePricingTypeEnum | null {
  //   return isRevision
  //     ? this.determineRevisionPricingType(projectType, mountingType, pricing)
  //     : this.determineNewPricingType(projectType, mountingType, pricing)
  // }

  // private determineNewPricingType(
  //   projectType: ProjectPropertyTypeEnum,
  //   mountingType: MountingTypeEnum,
  //   pricing: Pricing | CustomPricingEntity,
  // ): OrderedServicePricingTypeEnum | null {
  //   if (projectType === ProjectPropertyTypeEnum.Commercial && mountingType === MountingTypeEnum.Roof_Mount) {
  //     if (pricing instanceof CustomPricingEntity && pricing.hasNewCommercialPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_COMMERCIAL_NEW_PRICE
  //     }
  //     if (pricing instanceof Pricing) {
  //       return OrderedServicePricingTypeEnum.BASE_COMMERCIAL_NEW_PRICE
  //     }
  //   }

  //   if (projectType === ProjectPropertyTypeEnum.Commercial && mountingType === MountingTypeEnum.Ground_Mount) {
  //     if (pricing instanceof CustomPricingEntity && pricing.hasNewCommercialPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_COMMERCIAL_GM_PRICE
  //     }
  //     if (pricing instanceof Pricing) {
  //       return OrderedServicePricingTypeEnum.BASE_COMMERCIAL_GM_PRICE
  //     }
  //   }

  //   if (projectType === ProjectPropertyTypeEnum.Residential && mountingType === MountingTypeEnum.Roof_Mount) {
  //     if (pricing instanceof CustomPricingEntity && pricing.hasNewResidentialTieredPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_NEW_PRICE
  //     }
  //     if (pricing instanceof CustomPricingEntity && pricing.isResidentialNewServiceFlatPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_NEW_FLAT_PRICE
  //     }
  //     if (pricing instanceof Pricing) {
  //       OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_NEW_PRICE
  //     }
  //   }

  //   if (projectType === ProjectPropertyTypeEnum.Residential && mountingType === MountingTypeEnum.Ground_Mount) {
  //     if (pricing instanceof CustomPricingEntity && pricing.hasNewResidentialTieredPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_GM_PRICE
  //     }
  //     if (pricing instanceof CustomPricingEntity && pricing.isResidentialNewServiceFlatPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_GM_FLAT_PRICE
  //     }
  //     if (pricing instanceof Pricing) {
  //       return OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_GM_PRICE
  //     }
  //   }
  //   return null
  // }

  // private determineRevisionPricingType(
  //   projectType: ProjectPropertyTypeEnum,
  //   mountingType: MountingTypeEnum,
  //   pricing: Pricing | CustomPricingEntity,
  // ): OrderedServicePricingTypeEnum | null {
  //   if (projectType === ProjectPropertyTypeEnum.Residential && mountingType === MountingTypeEnum.Roof_Mount) {
  //     if (pricing instanceof CustomPricingEntity && pricing.hasRevisionResidentialPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_REVISION_PRICE
  //     }
  //     if (pricing instanceof Pricing) {
  //       return OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_REVISION_PRICE
  //     }
  //   }

  //   if (projectType === ProjectPropertyTypeEnum.Residential && mountingType === MountingTypeEnum.Ground_Mount) {
  //     if (pricing instanceof CustomPricingEntity && pricing.hasRevisionResidentialPricing) {
  //       return OrderedServicePricingTypeEnum.CUSTOM_RESIDENTIAL_REVISION_GM_PRICE
  //     }
  //     if (pricing instanceof Pricing) {
  //       return OrderedServicePricingTypeEnum.BASE_RESIDENTIAL_REVISION_GM_PRICE
  //     }
  //   }

  //   if (
  //     pricing instanceof Pricing &&
  //     projectType === ProjectPropertyTypeEnum.Commercial &&
  //     mountingType === MountingTypeEnum.Ground_Mount
  //   ) {
  //     return OrderedServicePricingTypeEnum.BASE_COMMERCIAL_REVISION_PRICE
  //   }

  //   if (
  //     pricing instanceof Pricing &&
  //     projectType === ProjectPropertyTypeEnum.Commercial &&
  //     mountingType === MountingTypeEnum.Ground_Mount
  //   ) {
  //     return OrderedServicePricingTypeEnum.BASE_COMMERCIAL_REVISION_GM_PRICE
  //   }

  //   return null
  // }
}
