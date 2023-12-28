import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateJobHttpController } from './commands/create-job/create-job.http.controller'
import { JOB_REPOSITORY } from './job.di-token'
import { JobRepository } from './database/job.repository'
import { CreateJobService } from './commands/create-job/create-job.service'
import { JobMapper } from './job.mapper'
import { PrismaModule } from '../database/prisma.module'
import { AuthenticationModule } from '../auth/authentication.module'
import { UpdateJobHttpController } from './commands/update-job/update-job.http.controller'
import { UpdateJobService } from './commands/update-job/update-job.service'
import { FindJobQueryHandler } from './queries/find-job/find-job.query-handler'
import { FindJobHttpController } from './queries/find-job/find-job.http.controller'
import { FindJobPaginatedHttpController } from './queries/find-job-paginated/find-job.paginated.http.controller'
import { FindJobPaginatedQueryHandler } from './queries/find-job-paginated/find-job.paginated.query-handler'
import { DeleteJobHttpController } from './commands/delete-job/delete-job.http.controller'
import { DeleteJobService } from './commands/delete-job/delete-job.service'
import UserMapper from '../users/user.mapper'
import { FindMyActiveJobPaginatedHttpController } from './queries/find-my-active-jobs/find-my-active-job.paginated.http.controller'
import { FindMyActiveJobPaginatedQueryHandler } from './queries/find-my-active-jobs/find-my-active-job.paginated.query-handler'
import { UpdateJobNameWhenProjectIsUpdatedDomainEventHandler } from './application/event-handlers/update-job-name-when-project-is-updated.domain-event-handler'
import { StartJobWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/start-job-when-task-is-assigned.domain-event-handler'
import { CompleteJobWhenServiceIsCompletedDomainEventHandler } from './application/event-handlers/complete-job-when-service-is-completed.domain-event-handler'
import { CancelJobHttpController } from './commands/cancel-job/cancel-job.http.controller'
import { CancelJobService } from './commands/cancel-job/cancel-job.service'
import { HoldJobHttpController } from './commands/hold-job/hold-job.http.controller'
import { HoldJobService } from './commands/hold-job/hold-job.service'
import { FindJobToInvoiceHttpController } from './queries/find-job-to-invoice/find-job-to-invoice.http.controller'
import { FindJobToInvoiceQueryHandler } from './queries/find-job-to-invoice/find-job-to-invoice.query-handler'
import { UpdateJobWhenTaskIsReopenedDomainEventHandler } from './application/event-handlers/update-job-when-task-is-reopended.domain-event-handler'
import { UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler } from './application/event-handlers/update-job-revision-size-when-ordered-service-revision-size-updated.domain-event-handler'
import { UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler } from './application/event-handlers/update-pricing-type-when-ordered-service-applied.domain-event-handler'
import { UpdateJobWhenTaskIsUnassignedDomainEventHandler } from './application/event-handlers/update-job-when-task-is-unassigned.domain-event-handler'
import { SendDeliverablesHttpController } from './commands/send-deliverables/send-deliverables.http.controller'
import { SendDeliverablesService } from './commands/send-deliverables/send-deliverables.service'
import { FindMyOrderedJobPaginatedHttpController } from './queries/find-my-ordered-jobs/find-my-ordered-jobs.paginated.http.controller'
import { FindMyOrderedJobPaginatedQueryHandler } from './queries/find-my-ordered-jobs/find-my-ordered-jobs.paginated.query-handler'

const httpControllers = [
  CreateJobHttpController,
  UpdateJobHttpController,
  DeleteJobHttpController,
  FindJobHttpController,
  FindJobPaginatedHttpController,
  FindMyActiveJobPaginatedHttpController,
  CancelJobHttpController,
  HoldJobHttpController,
  FindJobToInvoiceHttpController,
  SendDeliverablesHttpController,
  FindMyOrderedJobPaginatedHttpController,
]
const commandHandlers: Provider[] = [
  CreateJobService,
  UpdateJobService,
  DeleteJobService,
  CancelJobService,
  HoldJobService,
  SendDeliverablesService,
]
const queryHandlers: Provider[] = [
  FindJobQueryHandler,
  FindJobPaginatedQueryHandler,
  FindMyActiveJobPaginatedQueryHandler,
  FindJobToInvoiceQueryHandler,
  FindMyOrderedJobPaginatedQueryHandler,
]
const eventHandlers: Provider[] = [
  UpdateJobNameWhenProjectIsUpdatedDomainEventHandler,
  StartJobWhenTaskIsAssignedDomainEventHandler,
  CompleteJobWhenServiceIsCompletedDomainEventHandler,
  UpdateJobWhenTaskIsReopenedDomainEventHandler,
  UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler,
  UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler,
  UpdateJobWhenTaskIsUnassignedDomainEventHandler,
]
const repositories: Provider[] = [{ provide: JOB_REPOSITORY, useClass: JobRepository }]

const mappers: Provider[] = [JobMapper, UserMapper]

@Module({
  imports: [PrismaModule, CqrsModule, AuthenticationModule],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class JobModule {}
