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
import { ExpensePricingMapper } from '../expense-pricing/expense-pricing.mapper'
import { AssignTaskHttpController } from './commands/assign-task/assign-task.http.controller'
import { AssignTaskService } from './commands/assign-task/assign-task.service'
import { UpdateTaskCostService } from './commands/update-task-cost/update-task-cost.service'
import { UpdateTaskCostHttpController } from './commands/update-task-cost/update-task-cost.http.controller'
import { FindAvailableWorkersHttpController } from './queries/find-available-workers/find-available-workers.http.controller'
import { FindAvailableWorkersQueryHandler } from './queries/find-available-workers/find-available-workers.query.handler'
import { FindRejectedTaskReasonHttpController } from './queries/find-rejected-task-reason-paginated/find-rejected-task-reason.paginated.http.controller'
import { UnassignAssignedTaskHttpController } from './commands/unassign-assigned-task/unassign-assigned-task.http.controller'
import { UnassignAssignedTaskService } from './commands/unassign-assigned-task/unassign-assigned-task.service'
import { RejectAssignedTaskHttpController } from './commands/reject-assigned-task/reject-assigned-task.http.controller'
import { RejectAssignedTaskService } from './commands/reject-assigned-task/reject-assigned-task.service'
import { FindRejectedTaskReasonPaginatedQueryHandler } from './queries/find-rejected-task-reason-paginated/find-rejected-task-reason.paginated.query-handler'
import { ActivateTaskWhenTaskIsCreatedDomainEventHandler } from './application/event-handlers/activate-task-when-task-is-created.domain-event-handler'
import { ActivateOtherTasksWhenTaskIsCompletedDomainEventHandler } from './application/event-handlers/activate-other-tasks-when-task-is-completed.domain-event-handler'
import { DetermineActiveStatusDomainService } from './domain/domain-services/determine-active-status.domain-service'
import { AssignTaskWhenTaskIsActivatedDomainEventHandler } from './application/event-handlers/assign-task-when-task-is-activated.domain-event-handler'
import { OrderModificationValidatorDomainService } from '../ordered-job/domain/domain-services/order-modification-validator.domain-service'
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'

const httpControllers = [
  AssignTaskHttpController,
  FindAssignedTaskHttpController,
  FindAssignedTaskPaginatedHttpController,
  CompleteAssignedTaskHttpController,
  UpdateTaskDurationHttpController,
  UpdateTaskCostHttpController,
  FindAvailableWorkersHttpController,
  FindRejectedTaskReasonHttpController,
  UnassignAssignedTaskHttpController,
  RejectAssignedTaskHttpController,
]
const commandHandlers: Provider[] = [
  AssignTaskService,
  CompleteAssignedTaskService,
  UpdateTaskDurationService,
  UpdateTaskCostService,
  UnassignAssignedTaskService,
  RejectAssignedTaskService,
]
const queryHandlers: Provider[] = [
  FindAssignedTaskQueryHandler,
  FindAssignedTaskPaginatedQueryHandler,
  FindAvailableWorkersQueryHandler,
  FindRejectedTaskReasonPaginatedQueryHandler,
]
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
  ActivateOtherTasksWhenTaskIsCompletedDomainEventHandler,
  ActivateTaskWhenTaskIsCreatedDomainEventHandler,
  AssignTaskWhenTaskIsActivatedDomainEventHandler,
]
const domainServices: Provider[] = [
  CalculateVendorCostDomainService,
  UpdateTaskCostService,
  DetermineActiveStatusDomainService,
  OrderModificationValidatorDomainService,
]
const mappers: Provider[] = [
  AssignedTaskMapper,
  UserMapper,
  UserRoleMapper,
  JobMapper,
  InvoiceMapper,
  ExpensePricingMapper,
]

@Module({
  imports: [CqrsModule, PrismaModule, OrderedServiceModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
})
export class AssignedTaskModule {}
