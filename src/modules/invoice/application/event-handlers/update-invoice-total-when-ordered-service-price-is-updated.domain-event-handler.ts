/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OnEvent } from '@nestjs/event-emitter'
import { Inject } from '@nestjs/common'
import { OrderedServicePriceUpdatedDomainEvent } from '../../../ordered-service/domain/events/ordered-service-price-updated.domain-event'
import { OrderedServiceRepositoryPort } from '../../../ordered-service/database/ordered-service.repository.port'
import { CustomPricingRepositoryPort } from '../../../custom-pricing/database/custom-pricing.repository.port'
import { ORDERED_SERVICE_REPOSITORY } from '../../../ordered-service/ordered-service.di-token'
import { CUSTOM_PRICING_REPOSITORY } from '../../../custom-pricing/custom-pricing.di-token'
import { ServiceRepositoryPort } from '../../../service/database/service.repository.port'
import { SERVICE_REPOSITORY } from '../../../service/service.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { CalculateInvoiceService } from '../../domain/calculate-invoice-service.domain-service'
import { InvoiceRepositoryPort } from '../../database/invoice.repository.port'
import { INVOICE_REPOSITORY } from '../../invoice.di-token'

export class UpdateInvoiceTotalWhenOrderedServicePriceIsUpddatedDomainEventHandler {
  constructor(
    // @ts-ignore
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: InvoiceRepositoryPort,
    // @ts-ignore
    @Inject(JOB_REPOSITORY)
    private readonly jobRepo: JobRepositoryPort,
    // @ts-ignore
    @Inject(ORDERED_SERVICE_REPOSITORY)
    private readonly orderedServiceRepo: OrderedServiceRepositoryPort,
    // @ts-ignore
    @Inject(CUSTOM_PRICING_REPOSITORY)
    private readonly customPricingRepo: CustomPricingRepositoryPort,
    // @ts-ignore
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepo: ServiceRepositoryPort,
    private readonly calcInvoiceService: CalculateInvoiceService,
  ) {}
  @OnEvent(OrderedServicePriceUpdatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: OrderedServicePriceUpdatedDomainEvent) {
    const job = await this.jobRepo.findJobOrThrow(event.jobId)
    if (!job.invoiceId) return

    const jobs = await this.jobRepo.findManyBy({ invoiceId: job.invoiceId })
    const orderedServices = await this.orderedServiceRepo.findBy({ jobId: { in: jobs.map((job) => job.id) } })

    const subTotal = orderedServices.reduce((pre, cur) => {
      return pre + Number(cur.price)
    }, 0)
    const discount = await this.calcInvoiceService.calcDiscountAmount(orderedServices, this.serviceRepo)

    const invoice = await this.invoiceRepo.findOneOrThrow(job.invoiceId)
    invoice.updateCost(subTotal, discount)

    await this.invoiceRepo.update(invoice)
  }
}
