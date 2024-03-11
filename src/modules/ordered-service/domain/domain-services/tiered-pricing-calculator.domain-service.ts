import { Inject } from '@nestjs/common'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { SameScopeCompletionOrderCalculator } from './same-scope-completion-order-calculator.domain-service'
import { OrderedServiceEntity } from '../ordered-service.entity'
import { ScopeRevisionChecker } from './scope-revision-checker.domain-service'
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object'

export class TieredPricingCalculator {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort,
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    @Inject(CUSTOM_PRICING_REPOSITORY) private readonly customPricingRepo: CustomPricingRepositoryPort,
    private readonly scopeRevisionChecker: ScopeRevisionChecker,
    private readonly sameScopeCompletionOrderCalculator: SameScopeCompletionOrderCalculator,
  ) {}

  async isTieredPricingScope(orderedScope: OrderedServiceEntity): Promise<boolean> {
    const project = await this.projectRepo.findOneOrThrow({ id: orderedScope.projectId })
    const customPricing = await this.customPricingRepo.findOne(
      new ServiceId({ value: orderedScope.serviceId }),
      orderedScope.organizationId,
    )

    if (project.isCommercial) {
      return false
    }

    if (await this.scopeRevisionChecker.isRevision(orderedScope)) {
      return false
    }

    if (!customPricing?.hasNewResidentialTieredPricing) {
      return false
    }

    return true
  }

  /**
   * property Type대신 프로젝트 엔티티를 받는 이유는 주문된 스코프에 중복 저장된 데이터 대신 더 신뢰성 있는 데이터를 사용하기 위함이다.
   * 따라서, 그럴거면 그냥 여기서 프로젝트를 인자로 받지 말고 repository를 이용해서 조회하자.
   */
  async calc(orderedScope: OrderedServiceEntity): Promise<number | null> {
    const job = await this.jobRepo.findJobOrThrow(orderedScope.jobId)
    const customPricing = await this.customPricingRepo.findOneOrThrow(
      new ServiceId({ value: orderedScope.serviceId }),
      orderedScope.organizationId,
    )

    // 클라이언트가 이번 달에 주문한 동일한 New Scope 중에서 몇번째로 완료된 Scope인가?
    const currentQuantity = await this.sameScopeCompletionOrderCalculator.calc(orderedScope)

    // 완료된 개수에 설정된 가격을 적용한다.
    const tier = customPricing.getVolumeTieredPrice(currentQuantity)
    if (!tier) return orderedScope.price

    return job.mountingType === MountingTypeEnum.Ground_Mount ? tier.gmPrice : tier.price
  }
}
