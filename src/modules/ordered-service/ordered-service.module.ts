import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
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
import { CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler } from './application/event-handlers/complete-ordered-service-when-task-is-completed.domain-event-handler'
import { CancelOrderedServiceWhenJobIsCanceledDomainEventHandler } from './application/event-handlers/cancel-ordered-service-when-job-is-canceled.domain-event-handler'
import { ServiceRepository } from '../service/database/service.repository'
import { SERVICE_REPOSITORY } from '../service/service.di-token'
import { CustomPricingRepository } from '../custom-pricing/database/custom-pricing.repository'
import { CUSTOM_PRICING_REPOSITORY } from '../custom-pricing/custom-pricing.di-token'
import { ServiceMapper } from '../service/service.mapper'
import { CustomPricingMapper } from '../custom-pricing/custom-pricing.mapper'
import { UpdateManualPriceHttpController } from './command/update-manual-price/update-manual-price.http.controller'
import { UpdateRevisionSizeHttpController } from './command/update-revision-size/update-revision-size.http.controller'
import { UpdateManualPriceService } from './command/update-manual-price/update-manual-price-service.service'
import { UpdateRevisionSizeService } from './command/update-revision-size/update-revision-size.service'
import { UpdateOrderedServicePriceWhenTaskDurationUpdatedDomainEventHandler } from './application/event-handlers/update-ordered-service-price-when-task-duration-updated.domain-event-handler'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepository } from '../organization/database/organization.repository'
import { JOB_REPOSITORY } from '../ordered-job/job.di-token'
import { JobRepository } from '../ordered-job/database/job.repository'
import { INVOICE_REPOSITORY } from '../invoice/invoice.di-token'
import { InvoiceRepository } from '../invoice/database/invoice.repository'
import { ServiceInitialPriceManager } from './domain/ordered-service-manager.domain-service'
import { UserRoleMapper } from '../users/user-role.mapper'
import { OrganizationMapper } from '../organization/organization.mapper'
import { JobMapper } from '../ordered-job/job.mapper'
import { InvoiceMapper } from '../invoice/invoice.mapper'
import { PROJECT_REPOSITORY } from '../project/project.di-token'
import { ProjectRepository } from '../project/database/project.repository'
import { ProjectMapper } from '../project/project.mapper'
import { FindOrderedServicePaginatedHttpController } from './queries/find-ordered-service-paginated/find-ordered-service-paginated.http.controller'

const httpControllers = [
  CreateOrderedServiceHttpController,
  UpdateOrderedServiceHttpController,
  // DeleteOrderedServiceHttpController,
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
  // DeleteOrderedServiceService,
  CancelOrderedServiceService,
  ReactivateOrderedServiceService,
  UpdateManualPriceService,
  UpdateRevisionSizeService,
]
const queryHandlers: Provider[] = [FindOrderedServiceQueryHandler, FindOrderedServiceQueryHandler]
const eventHandlers: Provider[] = [
  CreateOrderedServiceWhenJobIsCreatedEventHandler,
  CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler,
  CancelOrderedServiceWhenJobIsCanceledDomainEventHandler,
  UpdateOrderedServicePriceWhenTaskDurationUpdatedDomainEventHandler,
]
const repositories: Provider[] = [
  { provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository },
  { provide: SERVICE_REPOSITORY, useClass: ServiceRepository },
  { provide: CUSTOM_PRICING_REPOSITORY, useClass: CustomPricingRepository },
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
  { provide: JOB_REPOSITORY, useClass: JobRepository },
  { provide: INVOICE_REPOSITORY, useClass: InvoiceRepository },
  { provide: PROJECT_REPOSITORY, useClass: ProjectRepository },
]

const domainServices: Provider[] = [ServiceInitialPriceManager]

const mappers: Provider[] = [
  UserMapper,
  CustomPricingMapper,
  UserRoleMapper,
  OrganizationMapper,
  ServiceMapper,
  JobMapper,
  OrderedServiceMapper,
  InvoiceMapper,
  ProjectMapper,
]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
})
export class OrderedServiceModule {}
