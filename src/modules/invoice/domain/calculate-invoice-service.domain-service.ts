import { Injectable } from '@nestjs/common'
import { OrderedServiceEntity } from '../../ordered-service/domain/ordered-service.entity'
import { CustomPricingRepositoryPort } from '../../custom-pricing/database/custom-pricing.repository.port'
import { ServiceRepositoryPort } from '../../service/database/service.repository.port'

@Injectable()
export class CalculateInvoiceService {
  async getTier(
    target: OrderedServiceEntity,
    orderedServices: OrderedServiceEntity[],
    customPricingRepo: CustomPricingRepositoryPort,
  ) {
    const customPricing = await customPricingRepo.findOne(null, target.organizationId, target.serviceId)
    if (!customPricing) return // TODO: 예외처리 필요?
    if (!customPricing.hasNewResidentialTieredPricing) return
    const numberOfServices = this.calcNewResiServices(target, orderedServices)
    return customPricing.getVolumeTieredPrice(numberOfServices)
  }

  /**
   * 1. New Residential Service를 리스트한다. Standard와 현재 가격을 비교한다.
   * 2. 원래 가격과 현재 가격
   *
   * 할인 기준 파악이 필요하다.
   * 1. 볼륨티어만 계산하면 되는가?
   * 2. 볼륨티어 포함한 모든 협상된 가격이 기본가가되고 거기서 메뉴얼하게 수정한것에 대해서 할인가가 되는건가? (그렇다면 서비스별로 원가, 매뉴얼price가 필요하다.)
   */
  async calcDiscountAmount(orderedServices: OrderedServiceEntity[], serviceRepo: ServiceRepositoryPort) {
    let discountAmount = 0

    const newResidentialServices = orderedServices.filter((orderedService) => {
      return orderedService.isNewResidentialService
    })

    for (const orderedService of newResidentialServices) {
      const service = await serviceRepo.findOne(orderedService.serviceId)
      if (!service?.getProps().pricing.standard) continue

      const standardGmPrice = Number(service.getProps().pricing.standard?.residential?.gmPrice)
      const standardPrice = Number(service.getProps().pricing.standard?.residential?.price)
      if (standardGmPrice === 0 || standardPrice === 0) continue

      // gm,base 필드 선택 실수 조심하기.. 리팩토링 필요
      if (orderedService.isGroundMount) {
        discountAmount += standardGmPrice - Number(orderedService.price)
      } else if (orderedService.isRoofMount) {
        discountAmount += standardPrice - Number(orderedService.price)
      }
    }

    return discountAmount
  }

  private calcNewResiServices(target: OrderedServiceEntity, orderedServices: OrderedServiceEntity[]): number {
    let count = 0
    for (const orderedService of orderedServices) {
      if (orderedService.serviceId === target.serviceId && orderedService.isNewResidentialService) {
        count++
      }
    }
    return count
  }
}
