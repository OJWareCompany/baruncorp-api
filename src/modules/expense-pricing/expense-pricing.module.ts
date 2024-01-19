import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateExpensePricingHttpController } from './commands/create-expense-pricing/create-expense-pricing.http.controller'
import { UpdateExpensePricingHttpController } from './commands/update-expense-pricing/update-expense-pricing.http.controller'
import { DeleteExpensePricingHttpController } from './commands/delete-expense-pricing/delete-expense-pricing.http.controller'
import { FindExpensePricingHttpController } from './queries/find-expense-pricing/find-expense-pricing.http.controller'
import { FindExpensePricingPaginatedHttpController } from './queries/find-expense-pricing-paginated/find-expense-pricing.paginated.http.controller'
import { CreateExpensePricingService } from './commands/create-expense-pricing/create-expense-pricing.service'
import { UpdateExpensePricingService } from './commands/update-expense-pricing/update-expense-pricing.service'
import { DeleteExpensePricingService } from './commands/delete-expense-pricing/delete-expense-pricing.service'
import { FindExpensePricingPaginatedQueryHandler } from './queries/find-expense-pricing-paginated/find-expense-pricing.paginated.query-handler'
import { EXPENSE_PRICING_REPOSITORY } from './expense-pricing.di-token'
import { ExpensePricingRepository } from './database/expense-pricing.repository'
import { ExpensePricingMapper } from './expense-pricing.mapper'
import { FindCreatableExpensePricingHttpController } from './queries/find-creatable-expense-pricing/find-creatable-expense-pricing.http.controller'
import { UsersModule } from '../users/users.module'

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

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class ExpensePricingModule {}
