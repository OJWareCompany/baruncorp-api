/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { OrderedServiceAppliedTieredPricingDomainEvent } from '../../../ordered-service/domain/events/ordered-service-invoiced.domain-event'
import { PricingTypeEnum } from '../../../invoice/dtos/invoice.response.dto'

export class UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort,
  ) {}
  @OnEvent(OrderedServiceAppliedTieredPricingDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServiceAppliedTieredPricingDomainEvent) {
    const job = await this.jobRepo.findJobOrThrow(event.jobId)
    if (job.pricingType === PricingTypeEnum.Tiered) return
    job.applyTieredPricing()
    await this.jobRepo.update(job)
  }
}
