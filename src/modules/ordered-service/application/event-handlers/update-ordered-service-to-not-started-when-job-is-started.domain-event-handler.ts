/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { GenerateOrderedScopeModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/ordered-scope-modification-history.decorator'
import { JobStartedDomainEvent } from '../../../ordered-job/domain/events/job-started.domain-event'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'

/**
 * Job이 Canceled나 On Hold에서 Started로 업데이트 되었을 때
 * Scope의 상태를 백업하는 용도의 이벤트 핸들러다.
 *
 * 담당자가 있었던 On Hold 태스크는 In Progress로
 * 담당자가 없었던 On Hold 태스크는 Not Started로
 *
 * 태스크에서 업데이트해서 잡이 업데이트되었다면 다시 태스크 상태 업데이트를 할 필요가 없다.. 즉 핑퐁할 필요가 없음
 * In Progress 스코프가 포함되어있다면 스킵해도 되는걸까?
 */
export class UpdateOrderedServiceToNotStartedWhenJobIsStartedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
  ) {}
  @OnEvent(JobStartedDomainEvent.name, { promisify: true, async: true })
  @GenerateOrderedScopeModificationHistory({ invokedFrom: 'job' })
  async handle(event: JobStartedDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: event.aggregateId })
    orderedServices
      .filter((orderedService) => !orderedService.isAssigned())
      .map((orderedService) => orderedService.backToNotStarted({ invokedBy: 'job' }))

    orderedServices
      .filter((orderedService) => orderedService.isAssigned())
      .map((orderedService) => orderedService.start())

    await this.orderedServiceRepo.update(orderedServices)
  }
}
