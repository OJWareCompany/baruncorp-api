import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateVendorInvoiceHttpController } from './commands/create-vendor-invoice/create-vendor-invoice.http.controller'
import { DeleteVendorInvoiceHttpController } from './commands/delete-vendor-invoice/delete-vendor-invoice.http.controller'
import { FindVendorInvoiceHttpController } from './queries/find-vendor-invoice/find-vendor-invoice.http.controller'
import { FindVendorInvoicePaginatedHttpController } from './queries/find-vendor-invoice-paginated/find-vendor-invoice.paginated.http.controller'
import { CreateVendorInvoiceService } from './commands/create-vendor-invoice/create-vendor-invoice.service'
import { DeleteVendorInvoiceService } from './commands/delete-vendor-invoice/delete-vendor-invoice.service'
import { FindVendorInvoiceQueryHandler } from './queries/find-vendor-invoice/find-vendor-invoice.query-handler'
import { FindVendorInvoicePaginatedQueryHandler } from './queries/find-vendor-invoice-paginated/find-vendor-invoice.paginated.query-handler'
import { VENDOR_INVOICE_REPOSITORY } from './vendor-invoice.di-token'
import { VendorInvoiceRepository } from './database/vendor-invoice.repository'
import { VendorInvoiceMapper } from './vendor-invoice.mapper'
import { FindVendorToInvoicePaginatedHttpController } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.http.controller'
import { FindVendorToInvoiceLineItemsPaginatedHttpController } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.http.controller'
import { FindVendorToInvoicePaginatedQueryHandler } from './queries/find-vendor-to-invoice-paginated/find-vendor-to-invoice.paginated.query-handler'
import { FindVendorToInvoiceLineItemsQueryHandler } from './queries/find-vendor-to-invoice-line-items-paginated/find-vendor-to-invoice-line-items.paginated.query-handler'
import { FindVendorInvoiceLineItemHttpController } from './queries/find-vendor-invoice-line-item/find-vendor-invoice-line-item.http.controller'
import { FindVendorInvoiceLineItemQueryHandler } from './queries/find-vendor-invoice-line-item/find-vendor-invoice-line-item.query-handler'
import { UpdateVendorInvoiceSubtotalWhenTaskCostIsUpdatedDomainEventHandler } from './application/event-handlers/update-vendor-invoice-subtotal-when-task-cost-is-updated.domain-event-handler'
import { UpdatedVendorInvoiceWhenVendorCreditPaymentIsCanceledEventHandler } from './application/event-handlers/update-invoice-when-credit-payment-is-canceled.domain-event-handler'
import { PayVendorInvoiceWhenVendorCreditPaymentIsCreatedEventHandler } from './application/event-handlers/pay-vendor-invoice-when-vendor-credit-payment-is-created.domain-event-handler'
import { UpdatedVendorInvoiceWhenVendorPaymentIsCanceledEventHandler } from './application/event-handlers/update-invoice-when-payment-is-canceled.domain-event-handler'
import { VendorPayInvoiceWhenVendorPaymentIsCreatedEventHandler } from './application/event-handlers/pay-vendor-invoice-when-vendor-payment-is-created.domain-event-handler'
import { UpdateVendorInvoicedTotalHttpController } from './commands/update-vendor-invoiced-total/update-vendor-invoiced-total.http.controller'
import { UpdateVendorInvoiceHttpController } from './commands/update-vendor-invoice/update-vendor-invoice.http.controller'
import { UpdateVendorInvoicedTotalService } from './commands/update-vendor-invoiced-total/update-vendor-invoiced-total.service'
import { VendorCreditTransactionModule } from '../vendor-credit-transaction/vendor-credit-transaction.module'
import { UpdateVendorInvoiceService } from './commands/update-vendor-invoice/update-vendor-invoice.service'
import { VendorInvoiceCalculator } from './domain/domain-services/vendor-invoice-calculator.domain-service'
import { VendorPaymentModule } from '../vendor-payment/vendor-payment.module'
import { OrganizationModule } from '../organization/organization.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { ProjectModule } from '../project/project.module'
import { UsersModule } from '../users/users.module'
import { JobModule } from '../ordered-job/job.module'

const httpControllers = [
  CreateVendorInvoiceHttpController,
  DeleteVendorInvoiceHttpController,
  FindVendorInvoiceHttpController,
  FindVendorInvoicePaginatedHttpController,
  FindVendorToInvoicePaginatedHttpController,
  FindVendorToInvoiceLineItemsPaginatedHttpController,
  FindVendorInvoiceLineItemHttpController,
  UpdateVendorInvoicedTotalHttpController,
  UpdateVendorInvoiceHttpController,
]
const commandHandlers: Provider[] = [
  CreateVendorInvoiceService,
  DeleteVendorInvoiceService,
  UpdateVendorInvoicedTotalService,
  UpdateVendorInvoiceService,
]
const queryHandlers: Provider[] = [
  FindVendorInvoiceQueryHandler,
  FindVendorInvoicePaginatedQueryHandler,
  FindVendorToInvoicePaginatedQueryHandler,
  FindVendorInvoiceLineItemQueryHandler,
  FindVendorToInvoiceLineItemsQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: VENDOR_INVOICE_REPOSITORY,
    useClass: VendorInvoiceRepository,
  },
]
const eventHandlers: Provider[] = [
  PayVendorInvoiceWhenVendorCreditPaymentIsCreatedEventHandler,
  VendorPayInvoiceWhenVendorPaymentIsCreatedEventHandler,
  UpdatedVendorInvoiceWhenVendorCreditPaymentIsCanceledEventHandler,
  UpdatedVendorInvoiceWhenVendorPaymentIsCanceledEventHandler,
  UpdateVendorInvoiceSubtotalWhenTaskCostIsUpdatedDomainEventHandler,
]
const domainServices: Provider[] = [VendorInvoiceCalculator]
const mappers: Provider[] = [VendorInvoiceMapper]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ProjectModule,
    InvoiceModule,
    JobModule,
    OrganizationModule,
    UsersModule,
    AssignedTaskModule,
    forwardRef(() => VendorPaymentModule),
    forwardRef(() => VendorCreditTransactionModule),
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...domainServices],
})
export class VendorInvoiceModule {}
