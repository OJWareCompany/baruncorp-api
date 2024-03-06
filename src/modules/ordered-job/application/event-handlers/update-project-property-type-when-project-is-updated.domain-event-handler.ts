import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ProjectPropertyTypeUpdatedDomainEvent } from '../../../project/domain/events/project-property-type-updated.domain-event'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JOB_REPOSITORY } from '../../job.di-token'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { ServiceInitialPriceManager } from '../../../ordered-service/domain/ordered-service-manager.domain-service'
import { OrderModificationValidator } from '../../domain/domain-services/order-modification-validator.domain-service'
import { RevisionTypeUpdateValidationDomainService } from '../../../ordered-service/domain/domain-services/revision-type-update-validation.domain-service'

@Injectable()
export class UpdateProjectPropertyTypeWhenProjectIdUpdatedDomainEventHandler {
  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly calcService: ServiceInitialPriceManager,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
  ) {}
  @OnEvent(ProjectPropertyTypeUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: ProjectPropertyTypeUpdatedDomainEvent) {
    const jobs = await this.jobRepo.findManyBy({ projectId: event.aggregateId })
    if (jobs.length > 1) return

    const job = jobs[0]
    job.updateProjectPropertyType(event.projectPropertyType, event.systemSize)
    await this.jobRepo.update(jobs)

    // 이벤트로 처리해야함
    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: job.id })
    for (const orderedService of orderedServices) {
      await orderedService.setProjectPropertyType(
        event.projectPropertyType,
        this.calcService,
        this.orderModificationValidator,
        this.revisionTypeUpdateValidator,
      )
    }

    await this.orderedServiceRepo.update(orderedServices)
  }
}
