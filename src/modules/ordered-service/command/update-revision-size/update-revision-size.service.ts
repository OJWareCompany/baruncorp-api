/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { UpdateRevisionSizeCommand as UpdateRevisionSizeCommand } from './update-revision-size.command'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'

@CommandHandler(UpdateRevisionSizeCommand)
export class UpdateRevisionSizeService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
  ) {}
  async execute(command: UpdateRevisionSizeCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOneOrThrow(command.orderedServiceId)
    const service = await this.serviceRepo.findOneOrThrow(orderedService.getProps().serviceId)
    const job = await this.jobRepo.findJobOrThrow(orderedService.jobId)
    const organization = await this.organizationRepo.findOneOrThrow(job.organizationId)

    if (!orderedService.isRevision || organization.isSpecialRevisionPricing) return
    if (job.invoiceId !== null) {
      const invoice = await this.invoiceRepo.findOneOrThrow(job.invoiceId)
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    if (command.revisionSize === OrderedServiceSizeForRevisionEnum.Major) {
      const customPricing = await this.customPricingRepo.findOne(organization.id, service.id)

      const isFixedPricing = this.serviceInitialPriceManager.isFixedPricing(service, customPricing)
      if (isFixedPricing) return

      const previouslyOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
        job.projectId,
        service.id,
      )

      orderedService.updateRevisionSizeToMajor(
        this.serviceInitialPriceManager,
        service,
        organization,
        job,
        previouslyOrderedServices,
        customPricing,
      )
    } else if (command.revisionSize === OrderedServiceSizeForRevisionEnum.Minor) {
      orderedService.updateRevisionSizeToMinor()
    } else {
      orderedService.cleanRevisionSize()
    }
    await this.orderedServiceRepo.update(orderedService)
  }
}
