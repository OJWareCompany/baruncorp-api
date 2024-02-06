import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { UpdateOrderedServiceToNotStartedWhenJobIsUpdatedToNotStartedDomainEventHandler } from './application/event-handlers/update-ordered-service-to-not-started-when-job-is-updated-to-not-started.domain-event-handler'
import { CancelOrderedServiceWhenJobIsCanceledAndKeptInvoiceDomainEventHandler } from './application/event-handlers/cancel-ordered-service-when-job-is-canceled-and-kept-invoice.domain-event-handler'
import { UpdateOrderedServiceToNotStartedWhenJobIsStartedDomainEventHandler } from './application/event-handlers/update-ordered-service-to-not-started-when-job-is-started.domain-event-handler'
import { UpdateOrderedServicePriceWhenTaskDurationUpdatedDomainEventHandler } from './application/event-handlers/update-ordered-service-price-when-task-duration-updated.domain-event-handler'
import { DeleteOrderedServiceWhenJobIsDeletedDomainServiceHandler } from './application/event-handlers/delete-ordered-service-when-job-is-deleted.domain-service-handler'
import { CancelOrderedServiceWhenJobIsCanceledDomainEventHandler } from './application/event-handlers/cancel-ordered-service-when-job-is-canceled.domain-event-handler'
import { StartOrderedServiceWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/start-ordered-service-when-task-is-assigned.domain-event-handler'
import { HoldOrderedServiceWhenJobIsHeldDomainEventHandler } from './application/event-handlers/hold-ordered-service-when-job-is-held.domain-event-handler'
import { CreateOrderedServiceWhenJobIsCreatedEventHandler } from './application/event-handlers/create-ordered-service-when-job-is-created.domain-event-handler'
import { FindOrderedServicePaginatedHttpController } from './queries/find-ordered-service-paginated/find-ordered-service-paginated.http.controller'
import { RevisionTypeUpdateValidationDomainService } from './domain/domain-services/revision-type-update-validation.domain-service'
import { IntegratedOrderModificationHistoryModule } from '../integrated-order-modification-history/integrated-order-modification-history.module'
import { FindOrderedServicePaginatedQueryHandler } from './queries/find-ordered-service-paginated/find-ordered-service-paginated.query-handler'
import { UpdateOrderedScopeStatusHttpController } from './command/update-ordered-scope-status/update-ordered-scope-status.http.controller'
import { UpdateOrderedServiceHttpController } from './command/update-ordered-service/update-ordered-service.http.controller'
import { CreateOrderedServiceHttpController } from './command/create-ordered-service/create-ordered-service.http.controller'
import { OrderedScopeStatusChangeValidator } from './domain/domain-services/check-all-related-tasks-completed.domain-service'
import { FindOrderedServiceHttpController } from './queries/find-ordered-service/find-ordered-service.http.controller'
import { UpdateRevisionSizeHttpController } from './command/update-revision-size/update-revision-size.http.controller'
import { UpdateManualPriceHttpController } from './command/update-manual-price/update-manual-price.http.controller'
import { UpdateOrderedScopeStatusService } from './command/update-ordered-scope-status/update-ordered-scope-status.service'
import { FindOrderedServiceQueryHandler } from './queries/find-ordered-service/find-ordered-service.query-handler'
import { CreateOrderedServiceService } from './command/create-ordered-service/create-ordered-service.service'
import { UpdateOrderedServiceService } from './command/update-ordered-service/update-ordered-service.service'
import { ServiceInitialPriceManager } from './domain/ordered-service-manager.domain-service'
import { ORDERED_SERVICE_REPOSITORY } from './ordered-service.di-token'
import { UpdateRevisionSizeService } from './command/update-revision-size/update-revision-size.service'
import { UpdateManualPriceService } from './command/update-manual-price/update-manual-price-service.service'
import { OrderedServiceRepository } from './database/ordered-service.repository'
import { OrderedServiceMapper } from './ordered-service.mapper'
import { ScopeRevisionChecker } from './domain/domain-services/scope-revision-checker.domain-service'
import { CustomPricingModule } from '../custom-pricing/custom-pricing.module'
import { OrganizationModule } from '../organization/organization.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { ProjectModule } from '../project/project.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { ServiceModule } from '../service/service.module'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import { JobModule } from '../ordered-job/job.module'

const httpControllers = [
  CreateOrderedServiceHttpController,
  UpdateOrderedServiceHttpController,
  FindOrderedServiceHttpController,
  UpdateOrderedScopeStatusHttpController,
  UpdateManualPriceHttpController,
  UpdateRevisionSizeHttpController,
  FindOrderedServicePaginatedHttpController,
]
const commandHandlers: Provider[] = [
  CreateOrderedServiceService,
  UpdateOrderedServiceService,
  UpdateOrderedScopeStatusService,
  UpdateManualPriceService,
  UpdateRevisionSizeService,
]
const queryHandlers: Provider[] = [
  FindOrderedServiceQueryHandler,
  FindOrderedServiceQueryHandler,
  FindOrderedServicePaginatedQueryHandler,
]
const eventHandlers: Provider[] = [
  StartOrderedServiceWhenTaskIsAssignedDomainEventHandler,
  CreateOrderedServiceWhenJobIsCreatedEventHandler,
  CancelOrderedServiceWhenJobIsCanceledDomainEventHandler,
  CancelOrderedServiceWhenJobIsCanceledAndKeptInvoiceDomainEventHandler,
  HoldOrderedServiceWhenJobIsHeldDomainEventHandler,
  UpdateOrderedServicePriceWhenTaskDurationUpdatedDomainEventHandler,
  UpdateOrderedServiceToNotStartedWhenJobIsStartedDomainEventHandler,
  UpdateOrderedServiceToNotStartedWhenJobIsUpdatedToNotStartedDomainEventHandler,
  DeleteOrderedServiceWhenJobIsDeletedDomainServiceHandler,
]
const repositories: Provider[] = [{ provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository }]

const domainServices: Provider[] = [
  ServiceInitialPriceManager,
  OrderedScopeStatusChangeValidator,
  RevisionTypeUpdateValidationDomainService,
  ScopeRevisionChecker,
]

const mappers: Provider[] = [OrderedServiceMapper]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ServiceModule,
    CustomPricingModule,
    forwardRef(() => OrganizationModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => JobModule),
    forwardRef(() => AssignedTaskModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => IntegratedOrderModificationHistoryModule),
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers, ...domainServices],
})
export class OrderedServiceModule {}
