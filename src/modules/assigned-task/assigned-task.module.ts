import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { FindAssignedTaskHttpController } from './queries/find-assigned-task/find-assigned-task.http.controller'
import { FindAssignedTaskPaginatedHttpController } from './queries/find-assigned-task-paginated/find-assigned-task.paginated.http.controller'
import { FindAssignedTaskQueryHandler } from './queries/find-assigned-task/find-assigned-task.query-handler'
import { FindAssignedTaskPaginatedQueryHandler } from './queries/find-assigned-task-paginated/find-assigned-task.paginated.query-handler'
import { ASSIGNED_TASK_REPOSITORY } from './assigned-task.di-token'
import { AssignedTaskRepository } from './database/assigned-task.repository'
import { AssignedTaskMapper } from './assigned-task.mapper'
import { CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler } from './application/event-handlers/create-assigned-task-when-ordered-service-is-created.domain-event-handler'
import { CancelAssignedTaskWhenOrderedServiceIsCanceledDomainEventHandler } from './application/event-handlers/cancel-assigned-task-when-ordered-service-is-canceled.domain-event-handler'
import { CompleteAssignedTaskHttpController } from './commands/complete-assigned-task/complete-assigned-task.http.controller'
import { CompleteAssignedTaskService } from './commands/complete-assigned-task/complete-assigned-task.service'
import { HoldAssignedTaskWhenOrderedScopeIsHeldDomainEventHandler } from './application/event-handlers/hold-assigned-task-when-ordered-scope-is-held.domain-event-handler'
import { UpdateTaskDurationHttpController } from './commands/update-task-duration/update-task-duration.http.controller'
import { UpdateTaskDurationService } from './commands/update-task-duration/update-task-duration.service'
import { UpdateCostWhenOrderedServicePriceIsUpdatedDomainEventHandler } from './application/event-handlers/update-cost-when-ordered-service-price-is-updated.domain-event-handler'
import { UpdateCostWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/update-cost-when-task-is-assigned.domain-event-handler'
import { CalculateVendorCostDomainService } from './domain/calculate-vendor-cost.domain-service'
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
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { JobModule } from '../ordered-job/job.module'
import { UsersModule } from '../users/users.module'
import { ExpensePricingModule } from '../expense-pricing/expense-pricing.module'
import { BackToAssignedTaskWhenOrderedScopeIsStartedDomainEventHandler } from './application/event-handlers/back-to-not-started-assigned-task-when-ordered-scope-is-started.domain-event-handler'
import { BackToAssignedTaskWhenOrderedScopeIsBackToNotStartedDomainEventHandler } from './application/event-handlers/back-to-not-started-assigned-task-when-ordered-scope-is-back-to-not-started.domain-event-handler'
import { CancelAssignedTaskWhenOrderedServiceIsCanceledAndKeptInvoiceDomainEventHandler } from './application/event-handlers/cancel-assigned-task-when-ordered-service-is-canceled-and-kept-invoice.domain-event-handler'
import { IntegratedOrderModificationHistoryModule } from '../integrated-order-modification-history/integrated-order-modification-history.module'

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
const eventHandlers: Provider[] = [
  CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler,
  CancelAssignedTaskWhenOrderedServiceIsCanceledDomainEventHandler,
  HoldAssignedTaskWhenOrderedScopeIsHeldDomainEventHandler,
  UpdateCostWhenOrderedServicePriceIsUpdatedDomainEventHandler,
  UpdateCostWhenTaskIsAssignedDomainEventHandler,
  ActivateOtherTasksWhenTaskIsCompletedDomainEventHandler,
  ActivateTaskWhenTaskIsCreatedDomainEventHandler,
  AssignTaskWhenTaskIsActivatedDomainEventHandler,
  BackToAssignedTaskWhenOrderedScopeIsBackToNotStartedDomainEventHandler,
  BackToAssignedTaskWhenOrderedScopeIsStartedDomainEventHandler,
  CancelAssignedTaskWhenOrderedServiceIsCanceledAndKeptInvoiceDomainEventHandler,
]
const domainServices: Provider[] = [
  CalculateVendorCostDomainService,
  UpdateTaskCostService,
  DetermineActiveStatusDomainService,
]
const repositories: Provider[] = [
  {
    provide: ASSIGNED_TASK_REPOSITORY,
    useClass: AssignedTaskRepository,
  },
]
const mappers: Provider[] = [AssignedTaskMapper]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ExpensePricingModule,
    forwardRef(() => UsersModule),
    forwardRef(() => JobModule),
    forwardRef(() => OrderedServiceModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => IntegratedOrderModificationHistoryModule),
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class AssignedTaskModule {}
