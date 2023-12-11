import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { UpdateAssignedTaskHttpController } from './commands/update-assigned-task/update-assigned-task.http.controller'
import { FindAssignedTaskHttpController } from './queries/find-assigned-task/find-assigned-task.http.controller'
import { FindAssignedTaskPaginatedHttpController } from './queries/find-assigned-task-paginated/find-assigned-task.paginated.http.controller'
import { UpdateAssignedTaskService } from './commands/update-assigned-task/update-assigned-task.service'
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

const httpControllers = [
  UpdateAssignedTaskHttpController,
  FindAssignedTaskHttpController,
  FindAssignedTaskPaginatedHttpController,
  CompleteAssignedTaskHttpController,
  UpdateTaskDurationHttpController,
]
const commandHandlers: Provider[] = [UpdateAssignedTaskService, CompleteAssignedTaskService, UpdateTaskDurationService]
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
]
const eventHandlers: Provider[] = [
  CreateAssignedTasksWhenOrderedServiceIsCreatedDomainEventHandler,
  CancelAssignedTaskWhenOrderedServiceIsCanceledDomainEventHandler,
  ReopenAssignedTaskWhenOrderedServiceIsReactivedDomainEventHandler,
  HoldAssignedTaskWhenJobIsHeldDomainEventHandler,
]
const mappers: Provider[] = [AssignedTaskMapper, UserMapper, UserRoleMapper, JobMapper, InvoiceMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class AssignedTaskModule {}
