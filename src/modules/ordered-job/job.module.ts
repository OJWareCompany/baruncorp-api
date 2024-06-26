import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { IntegratedOrderModificationHistoryModule } from '../integrated-order-modification-history/integrated-order-modification-history.module'
import { AuthenticationModule } from '../auth/authentication.module'
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { OrganizationModule } from '../organization/organization.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { ProjectModule } from '../project/project.module'
import { ServiceModule } from '../service/service.module'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import { UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler } from './application/event-handlers/update-job-revision-size-when-ordered-service-revision-size-updated.domain-event-handler'
import { UpdateJobStatusWhenOrderedServiceStatusUpdatedDomainEventHandler } from './application/event-handlers/update-job-status-when-ordered-service-status-updated.domain-event-handler'
import { UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler } from './application/event-handlers/update-pricing-type-when-ordered-service-applied.domain-event-handler'
import { UpdateInvoiceIdWhenInvoiceIsCreatedDomainEventHandler } from './application/event-handlers/update-invoice-id-when-invoice-is-created.domain-event-handler'
import { UpdateJobNameWhenProjectIsUpdatedDomainEventHandler } from './application/event-handlers/update-job-name-when-project-is-updated.domain-event-handler'
import { UpdateDueDateWhenScopeIsOrderedDomainEventHandler } from './application/event-handlers/update-due-date-when-scope-is-ordered.domain-event-handler'
import { UpdateProjectPropertyTypeWhenProjectIdUpdatedDomainEventHandler } from './application/event-handlers/update-project-property-type-when-project-is-updated.domain-event-handler'
import { FindMyOrderedJobPaginatedHttpController } from './queries/find-my-ordered-jobs/find-my-ordered-jobs.paginated.http.controller'
import { FindMyOrderedJobPaginatedQueryHandler } from './queries/find-my-ordered-jobs/find-my-ordered-jobs.paginated.query-handler'
import { FindMyJobPaginatedHttpController } from './queries/find-my-jobs/find-my-job.paginated.http.controller'
import { FindMyJobPaginatedQueryHandler } from './queries/find-my-jobs/find-my-job.paginated.query-handler'
import { FindJobToInvoiceHttpController } from './queries/find-job-to-invoice/find-job-to-invoice.http.controller'
import { SendDeliverablesHttpController } from './commands/send-deliverables/send-deliverables.http.controller'
import { FindJobPaginatedHttpController } from './queries/find-job-paginated/find-job.paginated.http.controller'
import { UpdateJobStatusHttpController } from './commands/update-job-status/update-job-status.http.controller'
import { FindJobToInvoiceQueryHandler } from './queries/find-job-to-invoice/find-job-to-invoice.query-handler'
import { FindJobPaginatedQueryHandler } from './queries/find-job-paginated/find-job.paginated.query-handler'
import { JobToInvoiceResponseMapper } from './job-to-invoice.response.mapper'
import { OrderStatusChangeValidator } from './domain/domain-services/order-status-change-validator.domain-service'
import { OrderModificationValidator } from './domain/domain-services/order-modification-validator.domain-service'
import { FilesystemDomainService } from '../filesystem/domain/domain-service/filesystem.domain-service'
import { DeleteJobHttpController } from './commands/delete-job/delete-job.http.controller'
import { SendDeliverablesService } from './commands/send-deliverables/send-deliverables.service'
import { UpdateJobStatusService } from './commands/update-job-status/update-job-status.service'
import { TotalDurationCalculator } from './domain/domain-services/total-duration-calculator.domain-service'
import { CreateJobHttpController } from './commands/create-job/create-job.http.controller'
import { UpdateJobHttpController } from './commands/update-job/update-job.http.controller'
import { OrderDeletionValidator } from './domain/domain-services/order-deletion-validator.domain-service'
import { FindJobHttpController } from './queries/find-job/find-job.http.controller'
import { FilesystemApiService } from '../filesystem/infra/filesystem.api.service'
import { OrderedJobNoteModule } from '../ordered-job-note/job-note.module'
import { FindJobQueryHandler } from './queries/find-job/find-job.query-handler'
import { JobResponseMapper } from './job.response.mapper'
import { UpdateJobService } from './commands/update-job/update-job.service'
import { DeleteJobService } from './commands/delete-job/delete-job.service'
import { CreateJobService } from './commands/create-job/create-job.service'
import { JOB_REPOSITORY } from './job.di-token'
import { JobRepository } from './database/job.repository'
import { JobMapper } from './job.mapper'
import { DetermineJobStatus } from './domain/domain-services/determine-job-status.domain-service'
import { MakeDeliverablesEmailContents } from './domain/domain-services/make-deliverables-email-contents.domain-service'
import { UpdateJobDueDateHttpController } from './commands/update-job-due-date/update-job-due-date.http.controller'
import { UpdateJobDueDateService } from './commands/update-job-due-date/update-job-due-date.service'

const httpControllers = [
  CreateJobHttpController,
  UpdateJobHttpController,
  UpdateJobStatusHttpController,
  DeleteJobHttpController,
  FindJobHttpController,
  FindJobPaginatedHttpController,
  FindMyJobPaginatedHttpController,
  FindJobToInvoiceHttpController,
  SendDeliverablesHttpController,
  FindMyOrderedJobPaginatedHttpController,
  UpdateJobDueDateHttpController,
]
const commandHandlers: Provider[] = [
  CreateJobService,
  UpdateJobService,
  UpdateJobStatusService,
  DeleteJobService,
  SendDeliverablesService,
  UpdateJobDueDateService,
]
const queryHandlers: Provider[] = [
  FindJobQueryHandler,
  FindJobPaginatedQueryHandler,
  FindMyJobPaginatedQueryHandler,
  FindJobToInvoiceQueryHandler,
  FindMyOrderedJobPaginatedQueryHandler,
]
const eventHandlers: Provider[] = [
  UpdateJobNameWhenProjectIsUpdatedDomainEventHandler,
  UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler,
  UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler,
  UpdateInvoiceIdWhenInvoiceIsCreatedDomainEventHandler,
  UpdateDueDateWhenScopeIsOrderedDomainEventHandler,
  UpdateProjectPropertyTypeWhenProjectIdUpdatedDomainEventHandler,
  UpdateJobStatusWhenOrderedServiceStatusUpdatedDomainEventHandler,
]
const repositories: Provider[] = [{ provide: JOB_REPOSITORY, useClass: JobRepository }]
const mappers: Provider[] = [JobMapper, JobResponseMapper, JobToInvoiceResponseMapper]
const infrastructures: Provider[] = []
const domainServices: Provider[] = [
  TotalDurationCalculator,
  OrderStatusChangeValidator,
  OrderModificationValidator,
  OrderDeletionValidator,
  DetermineJobStatus,
  MakeDeliverablesEmailContents,
]

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    ServiceModule,
    OrganizationModule,
    OrderedJobNoteModule,
    forwardRef(() => AuthenticationModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => OrderedServiceModule),
    forwardRef(() => AssignedTaskModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => UsersModule),
    forwardRef(() => IntegratedOrderModificationHistoryModule),
  ],
  providers: [
    FilesystemApiService,
    FilesystemDomainService,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...repositories,
    ...mappers,
    ...infrastructures,
    ...domainServices,
  ],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers, ...domainServices],
})
export class JobModule {}
