import { Inject } from '@nestjs/common'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceEntity } from '../ordered-service.entity'

export class DuplicatedScopeChecker {
  constructor(
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedScopeRepo: OrderedServiceRepositoryPort,
  ) {}

  async isDuplicated(orderedScope: OrderedServiceEntity) {
    const existed = await this.orderedScopeRepo.findBy({ jobId: orderedScope.jobId, serviceId: orderedScope.serviceId })
    const duplicatedScope = existed.filter((orderedScope) => orderedScope.getProps().serviceName !== 'Other')
    return !!duplicatedScope.length
  }
}
