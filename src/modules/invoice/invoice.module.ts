import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { JobMapper } from '../ordered-job/job.mapper'
import { CUSTOM_PRICING_REPOSITORY } from '../custom-pricing/custom-pricing.di-token'
import { CustomPricingRepository } from '../custom-pricing/database/custom-pricing.repository'
import { CustomPricingMapper } from '../custom-pricing/custom-pricing.mapper'
import { JOB_REPOSITORY } from '../ordered-job/job.di-token'
import { JobRepository } from '../ordered-job/database/job.repository'
import { SERVICE_REPOSITORY } from '../service/service.di-token'
import { ServiceRepository } from '../service/database/service.repository'
import { ServiceMapper } from '../service/service.mapper'
import { CreateInvoiceHttpController } from './commands/create-invoice/create-invoice.http.controller'
import { UpdateInvoiceHttpController } from './commands/update-invoice/update-invoice.http.controller'
import { DeleteInvoiceHttpController } from './commands/delete-invoice/delete-invoice.http.controller'
import { FindInvoiceHttpController } from './queries/find-invoice/find-invoice.http.controller'
import { CreateInvoiceService } from './commands/create-invoice/create-invoice.service'
import { UpdateInvoiceService } from './commands/update-invoice/update-invoice.service'
import { DeleteInvoiceService } from './commands/delete-invoice/delete-invoice.service'
import { FindInvoiceQueryHandler } from './queries/find-invoice/find-invoice.query-handler'
import { INVOICE_REPOSITORY } from './invoice.di-token'
import { InvoiceRepository } from './database/invoice.repository'
import { InvoiceMapper } from './invoice.mapper'
import { FindInvoicePaginatedHttpController } from './queries/find-invoice-paginated/find-invoice.paginated.http.controller'
import { FindInvoicePaginatedQueryHandler } from './queries/find-invoice-paginated/find-invoice.paginated.query-handler'
import { FindClientToInvoiceQueryHandler } from './queries/find-client-to-invoice/find-client-to-invoice.query-handler'
import { FindClientToInvoiceHttpController } from './queries/find-client-to-invoice/find-client-to-invoice.http.controller'
import { IssueInvoiceHttpController } from './commands/issue-invoice/issue-invoice.http.controller'
import { IssueInvoiceService } from './commands/issue-invoice/issue-invoice.service'
import { PayInvoiceWhenPaymentIsCreatedEventHandler } from './application/event-handlers/pay-invoice-when-payment-is-created.domain-event-handler'
import { UpdatedInvoiceWhenPaymentIsCanceledEventHandler } from './application/event-handlers/update-invoice-when-payment-is-canceled.domain-event-handler'
import { CalculateInvoiceService } from './domain/calculate-invoice-service.domain-service'
import { UpdateInvoiceTotalWhenOrderedServicePriceIsUpddatedDomainEventHandler } from './application/event-handlers/update-invoice-total-when-ordered-service-price-is-updated.domain-event-handler'
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'

const httpControllers = [
  CreateInvoiceHttpController,
  UpdateInvoiceHttpController,
  DeleteInvoiceHttpController,
  FindInvoiceHttpController,
  FindInvoicePaginatedHttpController,
  FindClientToInvoiceHttpController,
  IssueInvoiceHttpController,
]
const commandHandlers: Provider[] = [
  CreateInvoiceService,
  UpdateInvoiceService,
  DeleteInvoiceService,
  IssueInvoiceService,
]
const queryHandlers: Provider[] = [
  FindInvoiceQueryHandler,
  FindInvoicePaginatedQueryHandler,
  FindClientToInvoiceQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: INVOICE_REPOSITORY,
    useClass: InvoiceRepository,
  },
  {
    provide: CUSTOM_PRICING_REPOSITORY,
    useClass: CustomPricingRepository,
  },
  {
    provide: JOB_REPOSITORY,
    useClass: JobRepository,
  },
  {
    provide: SERVICE_REPOSITORY,
    useClass: ServiceRepository,
  },
]

const eventHandlers: Provider[] = [
  PayInvoiceWhenPaymentIsCreatedEventHandler,
  UpdatedInvoiceWhenPaymentIsCanceledEventHandler,
  UpdateInvoiceTotalWhenOrderedServicePriceIsUpddatedDomainEventHandler,
]

const mappers: Provider[] = [InvoiceMapper, UserMapper, JobMapper, CustomPricingMapper, ServiceMapper]

const domainServices: Provider[] = [CalculateInvoiceService]
@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => OrderedServiceModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [
    {
      provide: INVOICE_REPOSITORY,
      useClass: InvoiceRepository,
    },
  ],
})
export class InvoiceModule {}
