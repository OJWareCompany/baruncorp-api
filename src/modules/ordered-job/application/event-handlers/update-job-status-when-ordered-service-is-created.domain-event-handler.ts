/**
 * 서비스 생성 이벤트 여러개 발생 시 잡 상태 업데이트가 제대로 되지 않음.
 */

// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { OnEvent } from '@nestjs/event-emitter'
// import { Inject } from '@nestjs/common'
// import { GenerateJobModificationHistory } from '../../../integrated-order-modification-history/domain/domain-services/job-modification-history.decorator'
// import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
// import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
// import { JobStatusNotUpdatedException } from '../../domain/job.error'
// import { DetermineJobStatus } from '../../domain/domain-services/determine-job-status.domain-service'
// import { JobRepositoryPort } from '../../database/job.repository.port'
// import { JOB_REPOSITORY } from '../../job.di-token'
// import { OrderedServiceCreatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-created.domain-event'

// export class UpdateJobStatusWhenOrderedServiceIsCreatedDomainEventHandler {
//   constructor(
//     @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
//     @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
//     private readonly checkCompletionJob: DetermineJobStatus,
//   ) {}

//   @OnEvent(OrderedServiceCreatedDomainEvent.name, { async: true, promisify: true })
//   @GenerateJobModificationHistory({ invokedFrom: 'scope' })
//   async handle(event: OrderedServiceCreatedDomainEvent) {
//     const orderedService = await this.orderedServiceRepo.findOneOrThrow(event.aggregateId)
//     const job = await this.jobRepository.findJobOrThrow(orderedService.jobId)
//     try {
//       console.log('[START]', 'determineCurrentStatus', job.jobStatus)
//       await job.determineCurrentStatus(this.checkCompletionJob)
//       console.log('[INPROGRESS]', 'determineCurrentStatus', job.jobStatus)
//       await this.jobRepository.update(job)
//       console.log('[END]', 'determineCurrentStatus', job.jobStatus)
//     } catch (error) {
//       console.log(error, 'err?!')
//       if (error instanceof JobStatusNotUpdatedException) return
//       throw error
//     }
//   }
// }
