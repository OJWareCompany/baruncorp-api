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

const httpControllers = [
  CreateOrderedServiceHttpController,
  UpdateOrderedServiceHttpController,
  // DeleteOrderedServiceHttpController,
  FindOrderedServiceHttpController,
  CancelOrderedServiceHttpController,
  ReactivateOrderedServiceHttpController,
]
const commandHandlers: Provider[] = [
  CreateOrderedServiceService,
  UpdateOrderedServiceService,
  // DeleteOrderedServiceService,
  CancelOrderedServiceService,
  ReactivateOrderedServiceService,
]
const queryHandlers: Provider[] = [FindOrderedServiceQueryHandler]
const eventHandlers: Provider[] = [
  CreateOrderedServiceWhenJobIsCreatedEventHandler,
  CompleteOrderedServiceWhenTaskIsCompletedDomainEventHandler,
  CancelOrderedServiceWhenJobIsCanceledDomainEventHandler,
]
const repositories: Provider[] = [{ provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository }]
const mappers: Provider[] = [OrderedServiceMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class OrderedServiceModule {}
