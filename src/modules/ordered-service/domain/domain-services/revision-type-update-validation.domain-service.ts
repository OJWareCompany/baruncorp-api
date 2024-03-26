/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { ServiceInitialPriceManager } from '../ordered-service-manager.domain-service'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { OrderedServiceEntity } from '../ordered-service.entity'
import { ProjectPropertyTypeEnum } from '../../../project/domain/project.type'
import {
  FixedPricingRevisionUpdateException,
  NewServiceRevisionUpdateException,
  OrderedServiceNonResidentialRevisionTypeUpdateException,
  SpecialRevisionPricingRevisionTypeUpdateException,
} from '../ordered-service.error'

@Injectable()
export class RevisionTypeUpdateValidationDomainService {
  constructor(
    private readonly calcService: ServiceInitialPriceManager,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
  ) {}

  async validate(orderedService: OrderedServiceEntity) {
    const job = await this.jobRepo.findJobOrThrow(orderedService.jobId)
    const organization = await this.organizationRepo.findOneOrThrow(job.organizationId)
    if (!orderedService.isRevision) throw new NewServiceRevisionUpdateException()
    if (orderedService.projectPropertyType !== ProjectPropertyTypeEnum.Residential) {
      // throw new OrderedServiceNonResidentialRevisionTypeUpdateException() // Commercial도 Major로 업데이트 되어야 하는데, 안그래도 되는지 확인해서 안그래도 되면 코드 제거할 것.
    }

    // revision type이 고정된 서비스는 업데이트 되면 안된다. (처음 한번만 셋팅)
    if (orderedService.sizeForRevision !== null && organization.isSpecialRevisionPricing)
      throw new SpecialRevisionPricingRevisionTypeUpdateException()

    // revision type이 고정된 서비스는 업데이트 되면 안된다. (처음 한번만 셋팅)
    const isFixedPricing = await this.calcService.isFixedPricing(orderedService)
    if (orderedService.sizeForRevision !== null && isFixedPricing) throw new FixedPricingRevisionUpdateException()
  }
}
