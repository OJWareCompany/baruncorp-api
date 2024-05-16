import { Inject } from '@nestjs/common'
import { OrderedScopeStatus, OrderedServiceStatusEnum } from '../../../ordered-service/domain/ordered-service.type'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { JobStatusEnum } from '../job.type'
import { JobEntity } from '../job.entity'
import { JobStatus } from '../job.type'
import { OrderedServiceEntity } from '../../../ordered-service/domain/ordered-service.entity'

export class DetermineJobStatus {
  constructor(@Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort) {}

  async determineCurrentStatus(job: JobEntity): Promise<JobStatus> {
    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: job.id })

    if (this.isCompletion(orderedServices)) {
      return JobStatusEnum.Completed
    }

    const isCanceled = orderedServices.every((os) => os.status === OrderedServiceStatusEnum.Canceled)
    if (isCanceled) {
      return JobStatusEnum.Canceled
    }

    if (this.isCanceledAndKeptInvoice(orderedServices)) {
      return JobStatusEnum.Canceled_Invoice
    }

    const isNotStarted = orderedServices.every((os) => os.status === OrderedServiceStatusEnum.Not_Started)

    if (isNotStarted) {
      return JobStatusEnum.Not_Started
    }

    if (this.isInProgressFn(orderedServices)) {
      return JobStatusEnum.In_Progress
    }

    return job.jobStatus
  }

  /**
   * In Progress 조건
   * 1. 스코프 일부가 In Progress
   * 2. Not Started 스코프를 제외한 나머지 스코프가 Job Completed 조건에 부합
   */
  isInProgressFn(orderedServices: OrderedServiceEntity[]): boolean {
    const inProgressRequiredStatuses: OrderedScopeStatus[] = [
      OrderedServiceStatusEnum.Canceled,
      OrderedServiceStatusEnum.Canceled_Invoice,
      OrderedServiceStatusEnum.Completed,
      OrderedServiceStatusEnum.Not_Started,
    ]

    const someInProgress = orderedServices.some((os) => os.status === OrderedServiceStatusEnum.In_Progress)

    const almostDoneAndSomeNotStarted =
      orderedServices.every((os) => inProgressRequiredStatuses.includes(os.status)) &&
      orderedServices.some((os) => os.status === OrderedServiceStatusEnum.Not_Started)

    return someInProgress || almostDoneAndSomeNotStarted
  }

  /**
   * Completed 조건
   * 1. 모든 스코프가 Completed에 부합한 상태일 때
   */
  isCompletion(orderedServices: OrderedServiceEntity[]): boolean {
    const completionRequiredStatuses: OrderedScopeStatus[] = [
      OrderedServiceStatusEnum.Canceled,
      OrderedServiceStatusEnum.Canceled_Invoice,
      OrderedServiceStatusEnum.Completed,
    ]

    return (
      orderedServices.every((os) => completionRequiredStatuses.includes(os.status)) &&
      orderedServices.some((os) => os.status === OrderedServiceStatusEnum.Completed)
    )
  }

  isCanceledAndKeptInvoice(orderedServices: OrderedServiceEntity[]): boolean {
    const canceledAndKeptInvoiceRequiredStatuses: OrderedScopeStatus[] = [
      OrderedServiceStatusEnum.Canceled,
      OrderedServiceStatusEnum.Canceled_Invoice,
    ]

    return (
      orderedServices.every((os) => canceledAndKeptInvoiceRequiredStatuses.includes(os.status)) &&
      orderedServices.some((os) => os.status === OrderedServiceStatusEnum.Canceled_Invoice)
    )
  }
}
