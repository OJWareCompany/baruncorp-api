/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateManualPriceCommand } from './update-manual-price.command'
import { OrderedServiceRepositoryPort } from '../../database/ordered-service.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../ordered-service.di-token'
import { OrderedServiceNotFoundException } from '../../domain/ordered-service.error'
import { PROJECT_REPOSITORY } from '../../../project/project.di-token'
import { ProjectRepositoryPort } from '../../../project/database/project.repository.port'
import { ORGANIZATION_REPOSITORY } from '../../../organization/organization.di-token'
import { OrganizationRepositoryPort } from '../../../organization/database/organization.repository.port'
import { ServiceInitialPriceManager } from '../../domain/ordered-service-manager.domain-service'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { INVOICE_REPOSITORY } from '../../../invoice/invoice.di-token'
import { InvoiceRepositoryPort } from '../../../invoice/database/invoice.repository.port'

/**
 * 나름 잘 리팩토링된 케이스
 * Application Service에서는 의존성을 제공하는 역할만 하고 주요 로직은 Domain method에 있다.
 */
@CommandHandler(UpdateManualPriceCommand)
export class UpdateManualPriceService implements ICommandHandler {
  constructor(
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY) private readonly orderedServiceRepo: OrderedServiceRepositoryPort, // @ts-ignore
    @Inject(PROJECT_REPOSITORY) private readonly projectRepo: ProjectRepositoryPort, // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort, // @ts-ignore
    @Inject(ORGANIZATION_REPOSITORY) private readonly organizationRepo: OrganizationRepositoryPort, // @ts-ignore
    @Inject(INVOICE_REPOSITORY) private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly serviceInitialPriceManager: ServiceInitialPriceManager,
  ) {}
  async execute(command: UpdateManualPriceCommand): Promise<void> {
    const orderedService = await this.orderedServiceRepo.findOne(command.orderedServiceId)
    if (!orderedService) throw new OrderedServiceNotFoundException()

    const project = await this.projectRepo.findProjectOrThrow(orderedService.projectId)
    const organization = await this.organizationRepo.findOneOrThrow(project.clientOrganizationId)
    const job = await this.jobRepo.findJobOrThrow(orderedService.jobId)
    const invoice = await this.invoiceRepo.findOne(job.invoiceId || '') // TODO: REFACTOR

    const preOrderedServices = await this.orderedServiceRepo.getPreviouslyOrderedServices(
      project.id,
      orderedService.getProps().serviceId,
    )

    orderedService.setManualPrice(
      organization,
      preOrderedServices,
      this.serviceInitialPriceManager,
      invoice,
      command.price,
    )

    await this.orderedServiceRepo.update(orderedService)
  }
}
