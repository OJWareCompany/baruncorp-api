import { CustomPricingEntity } from '../../../custom-pricing/domain/custom-pricing.entity'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { ProjectEntity } from '../../../project/domain/project.entity'
import { JobEntity } from '../../../ordered-job/domain/job.entity'
import { SameScopeCompletionOrderCalculator } from './same-scope-completion-order-calculator.domain-service'
import { OrderedServiceEntity } from '../ordered-service.entity'
import { ScopeRevisionChecker } from './scope-revision-checker.domain-service'

export class TieredPricingCalculator {
  constructor(
    private readonly scopeRevisionChecker: ScopeRevisionChecker,
    private readonly sameScopeCompletionOrderCalculator: SameScopeCompletionOrderCalculator,
  ) {}

  async calc(
    orderedScope: OrderedServiceEntity,
    project: ProjectEntity,
    job: JobEntity,
    customPricing: CustomPricingEntity,
  ): Promise<number | null> {
    if (project.isCommercial) {
      return orderedScope.price
    }

    if (await this.scopeRevisionChecker.isRevision(orderedScope)) {
      return orderedScope.price
    }

    // 클라이언트가 이번 달에 주문한 동일한 New Scope 중에서 몇번째로 완료된 Scope인가?
    const currentQuantity = await this.sameScopeCompletionOrderCalculator.calc(orderedScope)

    // 완료된 개수에 설정된 가격을 적용한다.
    const tier = customPricing.getVolumeTieredPrice(currentQuantity)
    if (!tier) return orderedScope.price

    return job.mountingType === MountingTypeEnum.Ground_Mount ? tier.gmPrice : tier.price
  }
}
