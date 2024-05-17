import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { OrderedServiceCreatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-created.domain-event'
import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
import { JobDueDateNotUpdatedException, JobStatusNotUpdatedException } from '../../domain/job.error'
import { TotalDurationCalculator } from '../../domain/domain-services/total-duration-calculator.domain-service'
import { DetermineJobStatus } from '../../domain/domain-services/determine-job-status.domain-service'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'

/**
 * 처음에 주문 했을때 due date를 이미 입력했다면 due date는 고정된다.
 * 왜냐하면, 처음에 due date를 입력해서 주문했을때는 스코프에 설정된 duration 기준으로 due date를 계산하지 않는데
 * 이후에 스코프를 추가주문 했을때는 due date를 스코프에 설정된 duration으로 계산하면 처음 입력했던 의도와 다르게 계산될 수 있다.
 *
 * 즉 due date는 둘 중 하나에 의해서만 결정된다.
 * 1. duration을 scope에 설정된 기준으로 자동 계산
 * 2. 직접 입력
 */
export class UpdateDueDateWhenScopeIsOrderedDomainEventHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    private readonly totalDurationCalculator: TotalDurationCalculator,
    private readonly checkCompletionJob: DetermineJobStatus,
  ) {}
  @OnEvent(OrderedServiceCreatedDomainEvent.name, { async: true, promisify: true })
  @GenerateJobModificationHistory({ invokedFrom: 'scope' })
  async handle(event: OrderedServiceCreatedDomainEvent): Promise<void> {
    const job = await this.jobRepo.findJobOrThrow(event.jobId)

    // TODO: UpdateJobStatusWhenOrderedServiceStatusUpdatedDomainEventHandler 중복 로직
    let statusChanged = true
    let dueDateChanged = true

    try {
      await job.determineCurrentStatusOrThrow(this.checkCompletionJob)
    } catch (error) {
      // 새로운 상태로 업데이트 되지 않아도 다음 로직을 이어가도록
      if (error instanceof JobStatusNotUpdatedException) {
        statusChanged = false
      } else {
        throw error
      }
    }

    try {
      await job.updateDueDateOrThrow({ calculator: this.totalDurationCalculator })
    } catch (error) {
      if (error instanceof JobDueDateNotUpdatedException) {
        dueDateChanged = false
      } else {
        throw error
      }
    }

    if (statusChanged || dueDateChanged) {
      await this.jobRepo.update(job)
    }
  }
}
