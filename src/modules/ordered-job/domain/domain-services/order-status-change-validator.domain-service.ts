/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { JobEntity } from '../job.entity'
import { AutoOnlyJobStatusEnum, JobStatus, JobStatusEnum } from '../job.type'
import { OrderedServiceStatusEnum } from '../../../ordered-service/domain/ordered-service.type'
import { JobNotStartableException } from '../job.error'

export class OrderStatusChangeValidator {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepository: OrderedServiceRepositoryPort, // @ts-ignore
  ) {}
  async validateJob(job: JobEntity, jobStatusEnum: JobStatus) {
    switch (jobStatusEnum) {
      case JobStatusEnum.Not_Started:
        await this.checkJobNotStartable(job)
        break
      case AutoOnlyJobStatusEnum.Sent_To_Client:
        await this.checkJobSendableToClient(job)
        break

      default:
        break
    }
  }

  /**
   *
   * 1. (In Progress, Completed) Scope가 있으면 설정 불가능
   * 2. 설정시 (Canceled, On Hold) Scope는 Not Started 상태로 수정된다.
   */
  private async checkJobNotStartable(job: JobEntity) {
    const constraints = [OrderedServiceStatusEnum.In_Progress, OrderedServiceStatusEnum.Completed]
    const orderedScopes = await this.orderedServiceRepository.findBy('jobId', [job.id])
    const isViolated = orderedScopes.some((scope) => constraints.includes(scope.status))
    if (isViolated) throw new JobNotStartableException()
  }

  /**
   * 1. 직접 수정 불가능
   * 2. Completed 상태에서 Send To Client 되면 Sent To Client 상태로 수정된다.
   * 3. 모든 Scope는 Completed / Canceled / Canceled (Invoice) 상태여야한다.
   * 4. 모든 Scope는 가격이 입력되어 있어야 한다. (0원은 가능)
   * 5. Scope (추가 / 제거 / 상태 수정)이 불가능하다.
   */
  private async checkJobSendableToClient(job: JobEntity) {
    job.isSendableOrThrow()
    const orderedScopes = await this.orderedServiceRepository.findBy('jobId', [job.id])
    orderedScopes.map((scope) => scope.isSendableOrThrow())
  }
}
