import { Module, Provider, forwardRef } from '@nestjs/common'
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
import { FindMyJobPaginatedHttpController } from './queries/find-my-jobs/find-my-job.paginated.http.controller'
import { FindMyJobPaginatedQueryHandler } from './queries/find-my-jobs/find-my-job.paginated.query-handler'
import { UpdateJobNameWhenProjectIsUpdatedDomainEventHandler } from './application/event-handlers/update-job-name-when-project-is-updated.domain-event-handler'
import { StartJobWhenOrderedServiceIsStartedDomainEventHandler } from './application/event-handlers/start-job-when-ordered-service-is-started.domain-event-handler'
import { FindJobToInvoiceHttpController } from './queries/find-job-to-invoice/find-job-to-invoice.http.controller'
import { FindJobToInvoiceQueryHandler } from './queries/find-job-to-invoice/find-job-to-invoice.query-handler'
import { UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler } from './application/event-handlers/update-job-revision-size-when-ordered-service-revision-size-updated.domain-event-handler'
import { UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler } from './application/event-handlers/update-pricing-type-when-ordered-service-applied.domain-event-handler'
import { SendDeliverablesHttpController } from './commands/send-deliverables/send-deliverables.http.controller'
import { SendDeliverablesService } from './commands/send-deliverables/send-deliverables.service'
import { FindMyOrderedJobPaginatedHttpController } from './queries/find-my-ordered-jobs/find-my-ordered-jobs.paginated.http.controller'
import { FindMyOrderedJobPaginatedQueryHandler } from './queries/find-my-ordered-jobs/find-my-ordered-jobs.paginated.query-handler'
import { Mailer } from './infrastructure/mailer.infrastructure'
import { TotalDurationCalculator } from './domain/domain-services/total-duration-calculator.domain-service'
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'
import { OrderStatusChangeValidator } from './domain/domain-services/order-status-change-validator.domain-service'
import { OrderModificationValidator } from './domain/domain-services/order-modification-validator.domain-service'
import { InvoiceModule } from '../invoice/invoice.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { ProjectModule } from '../project/project.module'
import { UsersModule } from '../users/users.module'
import { ServiceModule } from '../service/service.module'
import { OrganizationModule } from '../organization/organization.module'
import { UpdateJobStatusHttpController } from './commands/update-job-status/update-job-status.http.controller'
import { UpdateJobStatusService } from './commands/update-job-status/update-job-status.service'
import { JobResponseMapper } from './job.response.mapper'

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
]
const commandHandlers: Provider[] = [
  CreateJobService,
  UpdateJobService,
  UpdateJobStatusService,
  DeleteJobService,
  SendDeliverablesService,
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
  StartJobWhenOrderedServiceIsStartedDomainEventHandler,
  UpdateJobRevisionSizeWhenOrderedServiceRevisionSizeUpdatedDomainEventHandler,
  UpdatePricingTypeWhenOrderedServiceAppliedDomainEventHandler,
]
const repositories: Provider[] = [{ provide: JOB_REPOSITORY, useClass: JobRepository }]
const mappers: Provider[] = [JobMapper, JobResponseMapper]
const infrastructures: Provider[] = [Mailer]
const domainServices: Provider[] = [TotalDurationCalculator, OrderStatusChangeValidator, OrderModificationValidator]

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    ServiceModule,
    OrganizationModule,
    forwardRef(() => AuthenticationModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => OrderedServiceModule),
    forwardRef(() => AssignedTaskModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
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
