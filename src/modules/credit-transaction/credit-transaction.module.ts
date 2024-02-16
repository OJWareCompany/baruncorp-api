import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FindCreditTransactionPaginatedHttpController } from './queries/find-credit-transaction-paginated/find-credit-transaction.paginated.http.controller'
import { FindCreditTransactionPaginatedQueryHandler } from './queries/find-credit-transaction-paginated/find-credit-transaction.paginated.query-handler'
import { CancelCreditTransactionHttpController } from './commands/cancel-credit-transaction/cancel-credit-transaction.http.controller'
import { CreateCreditTransactionHttpController } from './commands/create-credit-transaction/create-credit-transaction.http.controller'
import { FindCreditTransactionHttpController } from './queries/find-credit-transaction/find-credit-transaction.http.controller'
import { FindCreditTransactionQueryHandler } from './queries/find-credit-transaction/find-credit-transaction.query-handler'
import { CreateCreditTransactionService } from './commands/create-credit-transaction/create-credit-transaction.service'
import { CancelCreditTransactionService } from './commands/cancel-credit-transaction/cancel-credit-transaction.service'
import { CREDIT_TRANSACTION_REPOSITORY } from './credit-transaction.di-token'
import { CreditTransactionRepository } from './database/credit-transaction.repository'
import { CreditTransactionMapper } from './credit-transaction.mapper'
import { OrganizationModule } from '../organization/organization.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import UserMapper from '../users/user.mapper'
import { CreditCalculator } from './domain/domain-services/credit-calculator.domain-service'

const httpControllers = [
  CreateCreditTransactionHttpController,
  CancelCreditTransactionHttpController,
  FindCreditTransactionHttpController,
  FindCreditTransactionPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateCreditTransactionService, CancelCreditTransactionService]
const queryHandlers: Provider[] = [FindCreditTransactionQueryHandler, FindCreditTransactionPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: CREDIT_TRANSACTION_REPOSITORY,
    useClass: CreditTransactionRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [CreditTransactionMapper, UserMapper]
const domainServices: Provider[] = [CreditCalculator]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    OrganizationModule,
    forwardRef(() => InvoiceModule),
    forwardRef(() => UsersModule),
    forwardRef(() => InvoiceModule),
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...domainServices, ...repositories],
})
export class CreditTransactionModule {}
