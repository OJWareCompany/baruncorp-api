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

    if (this.isNotStarted(orderedServices)) {
      return JobStatusEnum.Not_Started
    }

    if (this.isInProgress(orderedServices)) {
      return JobStatusEnum.In_Progress
    }

    return job.jobStatus
  }

  /**
   * Not Started 조건
   * 1. In Progress 혹은 Completed 스코프가 존재하지 않으며 Not Started 스코프가 포함될 때
   *  -> In Progress 상태가 아니며, Not Started 상태를 포함할 때
   */
  isNotStarted(orderedServices: OrderedServiceEntity[]): boolean {
    const isNotInProgress = !this.isInProgress(orderedServices)
    const isSomeNotStarted = orderedServices.some((os) => os.status === OrderedServiceStatusEnum.Not_Started)
    return isNotInProgress && isSomeNotStarted
  }

  /**
   * In Progress 조건
   * 1. 스코프 일부가 In Progress
   * 2. Not Started 스코프를 하나 이상 가지며 Not Started 스코프를 제외한 나머지 스코프가 Job Completed 조건에 부합
   */
  isInProgress(orderedServices: OrderedServiceEntity[]): boolean {
    const someInProgress = orderedServices.some((os) => os.status === OrderedServiceStatusEnum.In_Progress)

    const someNotStarted = orderedServices.some((os) => os.status === OrderedServiceStatusEnum.Not_Started)

    const isDoneWithoutNotStarted =
      someNotStarted &&
      this.isCompletion(orderedServices.filter((os) => os.status !== OrderedServiceStatusEnum.Not_Started))

    return someInProgress || isDoneWithoutNotStarted
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

/**
 * Not Started 스코프가 일부 존재할때
 * 1. In Progress인 경우 = In Progress 혹은 Completed 스코프가 존재할 때
 * 2. Not Started인 경우 = In Progress 혹은 Completed 스코프가 존재하지 않을 때
 */
