/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AggregateID } from '../../../../libs/ddd/entity.base'
import { OrderedServiceEntity } from '../../domain/ordered-service.entity'
import { IssuedJobUpdateException } from '../../../ordered-job/domain/job.error'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { CreateOrderedServiceCommand } from './create-ordered-service.command'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { MountingTypeEnum } from '../../../project/domain/project.type'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'

@CommandHandler(CreateOrderedServiceCommand)
export class CreateOrderedServiceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepo: ServiceRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY) private readonly customPricingRepo: CustomPricingRepositoryPort,
    // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepo: OrganizationRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
  ) {}

  /**
   * 1. 기본가 적용
   * 2. 할인가 적용 (new service 일 때)
   * 3. 가정용은 Revision일때 Major/Minor 여부에 따라 revision base price 청구
   * 4. 상업용은 New일때 시스템 사이즈별 가격
   * 5. 상업용은 Revision일때 시간에 따라 가격 적용
   * 가격은 인보이스 청구될때 정하는걸로 하자.
   */
  async execute(command: CreateOrderedServiceCommand): Promise<AggregateID> {
    const service = await this.serviceRepo.findOneOrThrow(command.serviceId)
    const job = await this.jobRepo.findJobOrThrow(command.jobId)
    const organization = await this.organizationRepo.findOneOrThrow(job.organizationId)

    if (job.invoiceId !== null) {
      const invoice = await this.invoiceRepo.findOneOrThrow(job.invoiceId)
      if (invoice.status !== 'Unissued') throw new IssuedJobUpdateException()
    }

    const previouslyOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
      job.projectId,
      command.serviceId,
    )

    const orderedServiceEntity = OrderedServiceEntity.create({
      projectId: job.projectId,
      jobId: command.jobId,
      isRevision: !!previouslyOrderedServices.length,
      serviceId: command.serviceId,
      serviceName: service.name,
      description: command.description,
      projectPropertyType: job.projectPropertyType,
      mountingType: job.mountingType as MountingTypeEnum,
      organizationId: job.organizationId,
      organizationName: job.organizationName,
    })

    const customPricing = await this.customPricingRepo.findOne(null, service.id, organization.id)

    orderedServiceEntity.determineInitialValues(
      this.serviceInitialPriceManager,
      service,
      organization,
      job,
      previouslyOrderedServices,
      customPricing,
    )

    await this.orderedServiceRepo.insert(orderedServiceEntity)
    return orderedServiceEntity.id
  }
}
