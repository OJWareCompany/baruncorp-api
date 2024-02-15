import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FindExpensePricingPaginatedHttpController } from './queries/find-expense-pricing-paginated/find-expense-pricing.paginated.http.controller'
import { FindCreatableExpensePricingHttpController } from './queries/find-creatable-expense-pricing/find-creatable-expense-pricing.http.controller'
import { FindExpensePricingPaginatedQueryHandler } from './queries/find-expense-pricing-paginated/find-expense-pricing.paginated.query-handler'
import { CreateExpensePricingHttpController } from './commands/create-expense-pricing/create-expense-pricing.http.controller'
import { UpdateExpensePricingHttpController } from './commands/update-expense-pricing/update-expense-pricing.http.controller'
import { DeleteExpensePricingHttpController } from './commands/delete-expense-pricing/delete-expense-pricing.http.controller'
import { FindExpensePricingHttpController } from './queries/find-expense-pricing/find-expense-pricing.http.controller'
import { CreateExpensePricingService } from './commands/create-expense-pricing/create-expense-pricing.service'
import { UpdateExpensePricingService } from './commands/update-expense-pricing/update-expense-pricing.service'
import { DeleteExpensePricingService } from './commands/delete-expense-pricing/delete-expense-pricing.service'
import { EXPENSE_PRICING_REPOSITORY } from './expense-pricing.di-token'
import { ExpensePricingRepository } from './database/expense-pricing.repository'
import { ExpensePricingMapper } from './expense-pricing.mapper'
import { OrganizationModule } from '../organization/organization.module'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import { ExpensePricingDomainService } from './domain/expense-pricing.domain-service'

const httpControllers = [
  CreateExpensePricingHttpController,
  UpdateExpensePricingHttpController,
  DeleteExpensePricingHttpController,
  FindExpensePricingHttpController,
  FindExpensePricingPaginatedHttpController,
  FindCreatableExpensePricingHttpController,
]
const commandHandlers: Provider[] = [
  CreateExpensePricingService,
  UpdateExpensePricingService,
  DeleteExpensePricingService,
]
const queryHandlers: Provider[] = [FindExpensePricingPaginatedQueryHandler, FindExpensePricingPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: EXPENSE_PRICING_REPOSITORY,
    useClass: ExpensePricingRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [ExpensePricingMapper]
const domainServices: Provider[] = [ExpensePricingDomainService]

@Module({
  imports: [CqrsModule, PrismaModule, OrganizationModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class ExpensePricingModule {}
