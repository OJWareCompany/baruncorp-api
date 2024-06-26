import { OnEvent } from '@nestjs/event-emitter'
import { JobSystemSizeUpdatedDomainEvent } from '../../../ordered-job/domain/events/job-system-size-updated.domain-event'
import { Inject } from '@nestjs/common'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { OrderModificationValidator } from '../../../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { RevisionTypeUpdateValidationDomainService } from '../../domain/domain-services/revision-type-update-validation.domain-service'
import { JobMountingTypeUpdatedDomainEvent } from '../../../ordered-job/domain/events/job-mounting-type-updated.domain-event'
import { TieredPricingCalculator } from '../../domain/domain-services/tiered-pricing-calculator.domain-service'

export class ResetOrderedServicePriceWhenMountingTypeIsUpdatedDomainEventHandler {
  constructor(
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    private readonly calcService: ServiceInitialPriceManager,
    private readonly orderModificationValidator: OrderModificationValidator,
    private readonly revisionTypeUpdateValidator: RevisionTypeUpdateValidationDomainService,
    private readonly tieredPricingCalculator: TieredPricingCalculator,
  ) {}
  @OnEvent(JobMountingTypeUpdatedDomainEvent.name, { promisify: true, async: true })
  async handle(event: JobMountingTypeUpdatedDomainEvent) {
    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: event.aggregateId })
    for (const orderedService of orderedServices) {
      await orderedService.determineInitialValues(
        this.calcService,
        this.orderModificationValidator,
        this.revisionTypeUpdateValidator,
        this.tieredPricingCalculator,
      )
    }

    await this.orderedServiceRepo.update(orderedServices)
  }
}
