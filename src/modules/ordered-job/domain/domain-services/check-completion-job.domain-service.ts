import { Inject } from '@nestjs/common'
import { OrderedScopeStatus, OrderedServiceStatusEnum } from '../../../ordered-service/domain/ordered-service.type'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { JobStatusEnum } from '../job.type'
import { JobEntity } from '../job.entity'
import { JobStatus } from '../job.type'

export class CheckCompletionJob {
  constructor(@Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort) {}

  async determineCurrentStatus(job: JobEntity): Promise<JobStatus> {
    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: job.id })
    const permittedStatus: OrderedScopeStatus[] = [
      OrderedServiceStatusEnum.Canceled,
      OrderedServiceStatusEnum.Canceled_Invoice,
      OrderedServiceStatusEnum.Completed,
    ]

    const isCompleted =
      orderedServices.every((os) => permittedStatus.includes(os.status)) &&
      orderedServices.find((os) => os.status === OrderedServiceStatusEnum.Completed)
    if (isCompleted) {
      return JobStatusEnum.Completed
    }

    const isCanceled = orderedServices.every((os) => os.status === OrderedServiceStatusEnum.Canceled)
    if (isCanceled) {
      return JobStatusEnum.Canceled
    }

    const canceledAndKeptInvoice: OrderedScopeStatus[] = [
      OrderedServiceStatusEnum.Canceled,
      OrderedServiceStatusEnum.Canceled_Invoice,
    ]
    const isCanceledAndKeptInvoice =
      orderedServices.every((os) => canceledAndKeptInvoice.includes(os.status)) &&
      orderedServices.find((os) => os.status === OrderedServiceStatusEnum.Canceled_Invoice)
    if (isCanceledAndKeptInvoice) {
      return JobStatusEnum.Canceled_Invoice
    }

    return job.jobStatus
  }
}
