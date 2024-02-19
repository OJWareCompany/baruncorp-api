import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { PayInvoiceWhenCreditPaymentIsCreatedEventHandler } from './application/event-handlers/pay-invoice-when-credit-payment-is-created.domain-event-handler'
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
import { UpdateInvoiceTotalWhenOrderedServicePriceIsUpdatedDomainEventHandler } from './application/event-handlers/update-invoice-total-when-ordered-service-price-is-updated.domain-event-handler'
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'
import { JobModule } from '../ordered-job/job.module'
import { UsersModule } from '../users/users.module'
import { ServiceModule } from '../service/service.module'
import { CustomPricingModule } from '../custom-pricing/custom-pricing.module'
import { FindClientWithOutstandingBalancesHttpController } from './queries/find-client-with-outstanding-balances/find-client-with-outstanding-balances.http.controller'
import { FindOverdueInvoicePaginatedHttpController } from './queries/find-overdue-invoices-paginated/find-overdue-invoices.paginated.http.controller'
import { FindOverdueInvoicePaginatedQueryHandler } from './queries/find-overdue-invoices-paginated/find-overdue-invoices.paginated.query-handler'
import { InvoiceCalculator } from './domain/domain-services/invoice-calculator.domain-service'
import { OrganizationModule } from '../organization/organization.module'
import { CreditTransactionModule } from '../credit-transaction/credit-transaction.module'
import { PaymentModule } from '../payment/payment.module'

const httpControllers = [
  CreateInvoiceHttpController,
  UpdateInvoiceHttpController,
  DeleteInvoiceHttpController,
  FindInvoiceHttpController,
  FindInvoicePaginatedHttpController,
  FindClientToInvoiceHttpController,
  IssueInvoiceHttpController,
  FindClientWithOutstandingBalancesHttpController,
  FindOverdueInvoicePaginatedHttpController,
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
  FindOverdueInvoicePaginatedQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: INVOICE_REPOSITORY,
    useClass: InvoiceRepository,
  },
]

const eventHandlers: Provider[] = [
  PayInvoiceWhenPaymentIsCreatedEventHandler,
  UpdatedInvoiceWhenPaymentIsCanceledEventHandler,
  UpdateInvoiceTotalWhenOrderedServicePriceIsUpdatedDomainEventHandler,
  PayInvoiceWhenCreditPaymentIsCreatedEventHandler,
]

const mappers: Provider[] = [InvoiceMapper]

const domainServices: Provider[] = [CalculateInvoiceService, InvoiceCalculator]
@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ServiceModule,
    CustomPricingModule,
    OrganizationModule,
    forwardRef(() => CreditTransactionModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => UsersModule),
    forwardRef(() => OrderedServiceModule),
    forwardRef(() => JobModule),
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...domainServices],
})
export class InvoiceModule {}
