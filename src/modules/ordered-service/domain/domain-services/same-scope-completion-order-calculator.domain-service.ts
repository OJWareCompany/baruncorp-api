/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceStatusEnum } from '../ordered-service.type'
import { OrderedServiceEntity } from '../ordered-service.entity'

export class SameScopeCompletionOrderCalculator {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedScopeRepo: OrderedServiceRepositoryPort,
  ) {}

  async calc(orderedScope: OrderedServiceEntity) {
    const completedScopesInOrderedMonth = await this.orderedScopeRepo.findPreviousSameScopesCompletedInOrderedMonth(
      orderedScope.organizationId,
      orderedScope.serviceId,
      orderedScope.orderedAt,
      OrderedServiceStatusEnum.Completed,
    )

    const completedScopes = completedScopesInOrderedMonth.filter((completed) => completed.id !== orderedScope.id)

    return ++completedScopes.length
  }
}
