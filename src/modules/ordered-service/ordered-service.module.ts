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
import { DeleteOrderedServiceHttpController } from './command/delete-ordered-service/delete-ordered-service.http.controller'
import { DeleteOrderedServiceService } from './command/delete-ordered-service/delete-ordered-service.service'
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
import { UpdateRevisionSizeHttpController } from './command/update-revision-size/update-mounting-type.http.controller'
import { UpdateManualPriceService } from './command/update-manual-price/update-manual-price-service.service'
import { UpdateRevisionSizeService } from './command/update-revision-size/update-mounting-type.service'

const httpControllers = [
  CreateOrderedServiceHttpController,
  UpdateOrderedServiceHttpController,
  // DeleteOrderedServiceHttpController,
  FindOrderedServiceHttpController,
  CancelOrderedServiceHttpController,
  ReactivateOrderedServiceHttpController,
  UpdateManualPriceHttpController,
  UpdateRevisionSizeHttpController,
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
const queryHandlers: Provider[] = [FindOrderedServiceQueryHandler]
const eventHandlers: Provider[] = [
  CreateOrderedServiceWhenJobIsCreatedEventHandler,
  CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler,
  CancelOrderedServiceWhenJobIsCanceledDomainEventHandler,
]
const repositories: Provider[] = [
  { provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository },
  { provide: SERVICE_REPOSITORY, useClass: ServiceRepository },
  { provide: CUSTOM_PRICING_REPOSITORY, useClass: CustomPricingRepository },
]
const mappers: Provider[] = [OrderedServiceMapper, UserMapper, ServiceMapper, CustomPricingMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class OrderedServiceModule {}
