/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { AssignedTaskCompletedDomainEvent } from '../../../assigned-task/domain/events/assigned-task-completed.domain-event'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { OrderedServiceCompletionCheckDomainService } from '../../domain/domain-services/check-all-related-tasks-completed.domain-service'

@Injectable()
export class CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly completionChecker: OrderedServiceCompletionCheckDomainService,
  ) {}

  /**
   * 주문 품목을 저장한다.
   */
  @OnEvent(AssignedTaskCompletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: AssignedTaskCompletedDomainEvent) {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    await orderedService.checkAllRelatedTasksCompleted(this.completionChecker)
    await this.orderedServiceRepo.update(orderedService)
  }
}
