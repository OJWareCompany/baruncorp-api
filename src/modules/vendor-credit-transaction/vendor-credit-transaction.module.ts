import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FindVendorCreditTransactionPaginatedHttpController } from './queries/find-vendor-credit-transaction-paginated/find-vendor-credit-transaction.paginated.http.controller'
import { FindVendorCreditTransactionPaginatedQueryHandler } from './queries/find-vendor-credit-transaction-paginated/find-vendor-credit-transaction.paginated.query-handler'
import { CancelVendorCreditTransactionHttpController } from './commands/cancel-vendor-credit-transaction/cancel-vendor-credit-transaction.http.controller'
import { CreateVendorCreditTransactionHttpController } from './commands/create-vendor-credit-transaction/create-vendor-credit-transaction.http.controller'
import { FindVendorCreditTransactionHttpController } from './queries/find-vendor-credit-transaction/find-vendor-credit-transaction.http.controller'
import { FindVendorCreditTransactionQueryHandler } from './queries/find-vendor-credit-transaction/find-vendor-credit-transaction.query-handler'
import { CreateVendorCreditTransactionService } from './commands/create-vendor-credit-transaction/create-vendor-credit-transaction.service'
import { CancelVendorCreditTransactionService } from './commands/cancel-vendor-credit-transaction/cancel-vendor-credit-transaction.service'
import { VENDOR_CREDIT_TRANSACTION_REPOSITORY } from './vendor-credit-transaction.di-token'
import { VendorCreditTransactionRepository } from './database/vendor-credit-transaction.repository'
import { VendorCreditTransactionMapper } from './vendor-credit-transaction.mapper'
import { OrganizationModule } from '../organization/organization.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import UserMapper from '../users/user.mapper'
import { VendorCreditCalculator } from './domain/domain-services/vendor-credit-calculator.domain-service'
import { FindOrganizationCreditTransactionQueryHandler } from './queries/find-vendor-organization-credit-transaction/find-vendor-organization-credit-transaction.query-handler'
import { FindVendorOrganizationCreditTransactionHttpController } from './queries/find-vendor-organization-credit-transaction/find-vendor-organization-credit-transaction.http.controller'
import { VendorInvoiceModule } from '../vendor-invoice/vendor-invoice.module'

const httpControllers = [
  CreateVendorCreditTransactionHttpController,
  CancelVendorCreditTransactionHttpController,
  FindVendorCreditTransactionHttpController,
  FindVendorCreditTransactionPaginatedHttpController,
  FindVendorOrganizationCreditTransactionHttpController,
]
const commandHandlers: Provider[] = [CreateVendorCreditTransactionService, CancelVendorCreditTransactionService]
const queryHandlers: Provider[] = [
  FindVendorCreditTransactionQueryHandler,
  FindVendorCreditTransactionPaginatedQueryHandler,
  FindOrganizationCreditTransactionQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: VENDOR_CREDIT_TRANSACTION_REPOSITORY,
    useClass: VendorCreditTransactionRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [VendorCreditTransactionMapper, UserMapper]
const domainServices: Provider[] = [VendorCreditCalculator]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    OrganizationModule,
    forwardRef(() => InvoiceModule),
    forwardRef(() => UsersModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => VendorInvoiceModule),
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...domainServices, ...repositories],
})
export class VendorCreditTransactionModule {}
