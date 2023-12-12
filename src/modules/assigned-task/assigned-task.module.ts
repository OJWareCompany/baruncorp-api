import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { FindAssignedTaskHttpController } from './queries/find-assigned-task/find-assigned-task.http.controller'
import { FindAssignedTaskPaginatedHttpController } from './queries/find-assigned-task-paginated/find-assigned-task.paginated.http.controller'
import { FindAssignedTaskQueryHandler } from './queries/find-assigned-task/find-assigned-task.query-handler'
import { FindAssignedTaskPaginatedQueryHandler } from './queries/find-assigned-task-paginated/find-assigned-task.paginated.query-handler'
import { ASSIGNED_TASK_REPOSITORY } from './assigned-task.di-token'
import { AssignedTaskRepository } from './database/assigned-task.repository'
import { AssignedTaskMapper } from './assigned-task.mapper'
import { CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler } from './application/event-handlers/create-assigned-task-when-ordered-service-is-created.domain-event-handler'
import { CancelAssignedTaskWhenOrderedServiceIsCanceledDomainEventHandler } from './application/event-handlers/cancel-assigned-task-when-ordered-service-is-canceled.domain-event-handler'
import { ReopenAssignedTaskWhenOrderedServiceIsReactivedDomainEventHandler } from './application/event-handlers/reopen-assigned-task-when-ordered-service-is-reactivated.domain-event-handler'
import { CompleteAssignedTaskHttpController } from './commands/complete-assigned-task/complete-assigned-task.http.controller'
import { CompleteAssignedTaskService } from './commands/complete-assigned-task/complete-assigned-task.service'
import { HoldAssignedTaskWhenJobIsHeldDomainEventHandler } from './application/event-handlers/hold-assigned-task-when-job-is-held.domain-event-handler'
import { UpdateTaskDurationHttpController } from './commands/update-task-duration/update-task-duration.http.controller'
import { UpdateTaskDurationService } from './commands/update-task-duration/update-task-duration.service'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { JOB_REPOSITORY } from '../ordered-job/job.di-token'
import { JobRepository } from '../ordered-job/database/job.repository'
import { INVOICE_REPOSITORY } from '../invoice/invoice.di-token'
import { InvoiceRepository } from '../invoice/database/invoice.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { JobMapper } from '../ordered-job/job.mapper'
import { InvoiceMapper } from '../invoice/invoice.mapper'
import { UpdateCostWhenOrderedServicePriceIsUpdatedDomainEventHandler } from './application/event-handlers/update-cost-when-ordered-service-price-is-updated.domain-event-handler'
import { UpdateCostWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/update-cost-when-task-is-assigned.domain-event-handler'
import { ORDERED_SERVICE_REPOSITORY } from '../ordered-service/ordered-service.di-token'
import { OrderedServiceRepository } from '../ordered-service/database/ordered-service.repository'
import { EXPENSE_PRICING_REPOSITORY } from '../expense-pricing/expense-pricing.di-token'
import { ExpensePricingRepository } from '../expense-pricing/database/expense-pricing.repository'
import { CalculateVendorCostDomainService } from './domain/calculate-vendor-cost.domain-service'
import { OrderedServiceMapper } from '../ordered-service/ordered-service.mapper'
import { ExpensePricingMapper } from '../expense-pricing/expense-pricing.mapper'
import { AssignTaskHttpController } from './commands/assign-task/assign-task.http.controller'
import { AssignTaskService } from './commands/assign-task/assign-task.service'
import { UpdateTaskCostService } from './commands/update-task-cost/update-task-cost.service'
import { UpdateTaskCostHttpController } from './commands/update-task-cost/update-task-cost.http.controller'

const httpControllers = [
  AssignTaskHttpController,
  FindAssignedTaskHttpController,
  FindAssignedTaskPaginatedHttpController,
  CompleteAssignedTaskHttpController,
  UpdateTaskDurationHttpController,
  UpdateTaskCostHttpController,
]
const commandHandlers: Provider[] = [
  AssignTaskService,
  CompleteAssignedTaskService,
  UpdateTaskDurationService,
  UpdateTaskCostService,
]
const queryHandlers: Provider[] = [FindAssignedTaskQueryHandler, FindAssignedTaskPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: ASSIGNED_TASK_REPOSITORY,
    useClass: AssignedTaskRepository,
  },
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: JOB_REPOSITORY,
    useClass: JobRepository,
  },
  {
    provide: INVOICE_REPOSITORY,
    useClass: InvoiceRepository,
  },
  {
    provide: ORDERED_SERVICE_REPOSITORY,
    useClass: OrderedServiceRepository,
  },
  {
    provide: EXPENSE_PRICING_REPOSITORY,
    useClass: ExpensePricingRepository,
  },
]
const eventHandlers: Provider[] = [
  CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler,
  CancelAssignedTaskWhenOrderedServiceIsCanceledDomainEventHandler,
  ReopenAssignedTaskWhenOrderedServiceIsReactivedDomainEventHandler,
  HoldAssignedTaskWhenJobIsHeldDomainEventHandler,
  UpdateCostWhenOrderedServicePriceIsUpdatedDomainEventHandler,
  UpdateCostWhenTaskIsAssignedDomainEventHandler,
]
const domainServices: Provider[] = [CalculateVendorCostDomainService, UpdateTaskCostService]
const mappers: Provider[] = [
  AssignedTaskMapper,
  UserMapper,
  UserRoleMapper,
  JobMapper,
  InvoiceMapper,
  OrderedServiceMapper,
  ExpensePricingMapper,
]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
})
export class AssignedTaskModule {}
