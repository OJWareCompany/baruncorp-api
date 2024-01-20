import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateOrderedServiceHttpController } from './command/create-ordered-service/create-ordered-service.http.controller'
import { CreateOrderedServiceService } from './command/create-ordered-service/create-ordered-service.service'
import { ORDERED_SERVICE_REPOSITORY } from './ordered-service.di-token'
import { OrderedServiceRepository } from './database/ordered-service.repository'
import { OrderedServiceMapper } from './ordered-service.mapper'
import { UpdateOrderedServiceHttpController } from './command/update-ordered-service/update-ordered-service.http.controller'
import { UpdateOrderedServiceService } from './command/update-ordered-service/update-ordered-service.service'
import { FindOrderedServiceHttpController } from './queries/find-ordered-service/find-ordered-service.http.controller'
import { FindOrderedServiceQueryHandler } from './queries/find-ordered-service/find-ordered-service.query-handler'
import { CreateOrderedServiceWhenJobIsCreatedEventHandler } from './application/event-handlers/create-ordered-service-when-job-is-created.domain-event-handler'
import { CancelOrderedServiceHttpController } from './command/cancel-ordered-service/cancel-ordered-service.http.controller'
import { CancelOrderedServiceService } from './command/cancel-ordered-service/cancel-ordered-service.service'
import { ReactivateOrderedServiceHttpController } from './command/reactivate-ordered-service/reactivate-ordered-service.http.controller'
import { ReactivateOrderedServiceService } from './command/reactivate-ordered-service/reactivate-ordered-service.service'
import { CancelOrderedServiceWhenJobIsCanceledDomainEventHandler } from './application/event-handlers/cancel-ordered-service-when-job-is-canceled.domain-event-handler'
import { UpdateManualPriceHttpController } from './command/update-manual-price/update-manual-price.http.controller'
import { UpdateRevisionSizeHttpController } from './command/update-revision-size/update-revision-size.http.controller'
import { UpdateManualPriceService } from './command/update-manual-price/update-manual-price-service.service'
import { UpdateRevisionSizeService } from './command/update-revision-size/update-revision-size.service'
import { UpdateOrderedServicePriceWhenTaskDurationUpdatedDomainEventHandler } from './application/event-handlers/update-ordered-service-price-when-task-duration-updated.domain-event-handler'
import { ServiceInitialPriceManager } from './domain/ordered-service-manager.domain-service'
import { FindOrderedServicePaginatedHttpController } from './queries/find-ordered-service-paginated/find-ordered-service-paginated.http.controller'
import { FindOrderedServicePaginatedQueryHandler } from './queries/find-ordered-service-paginated/find-ordered-service-paginated.query-handler'
import { OrderedScopeStatusChangeValidator } from './domain/domain-services/check-all-related-tasks-completed.domain-service'
import { RevisionTypeUpdateValidationDomainService } from './domain/domain-services/revision-type-update-validation.domain-service'
import { InvoiceModule } from '../invoice/invoice.module'
import { JobModule } from '../ordered-job/job.module'
import { ProjectModule } from '../project/project.module'
import { OrganizationModule } from '../organization/organization.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { ServiceModule } from '../service/service.module'
import { UsersModule } from '../users/users.module'
import { CustomPricingModule } from '../custom-pricing/custom-pricing.module'
import { StartOrderedServiceWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/start-ordered-service-when-task-is-assigned.domain-event-handler'
import { HoldOrderedServiceWhenJobIsHeldDomainEventHandler } from './application/event-handlers/hold-ordered-service-when-job-is-held.domain-event-handler'
import { UpdateOrderedServiceToNotStartedWhenJobIsUpdatedToNotStartedDomainEventHandler } from './application/event-handlers/update-ordered-service-to-not-started-when-job-is-updated-to-not-started.domain-event-handler'
import { CancelOrderedServiceWhenJobIsCanceledAndKeptInvoiceDomainEventHandler } from './application/event-handlers/cancel-ordered-service-when-job-is-canceled-and-kept-invoice.domain-event-handler'

const httpControllers = [
  CreateOrderedServiceHttpController,
  UpdateOrderedServiceHttpController,
  FindOrderedServiceHttpController,
  CancelOrderedServiceHttpController,
  ReactivateOrderedServiceHttpController,
  UpdateManualPriceHttpController,
  UpdateRevisionSizeHttpController,
  FindOrderedServicePaginatedHttpController,
]
const commandHandlers: Provider[] = [
  CreateOrderedServiceService,
  UpdateOrderedServiceService,
  CancelOrderedServiceService,
  ReactivateOrderedServiceService,
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
  UpdateOrderedServiceToNotStartedWhenJobIsUpdatedToNotStartedDomainEventHandler,
]
const repositories: Provider[] = [{ provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository }]

const domainServices: Provider[] = [
  ServiceInitialPriceManager,
  OrderedScopeStatusChangeValidator,
  RevisionTypeUpdateValidationDomainService,
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
  ],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class OrderedServiceModule {}
