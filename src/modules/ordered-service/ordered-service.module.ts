import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../../../src/modules/database/prisma.module'
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

const httpControllers = [
  CreateOrderedServiceHttpController,
  UpdateOrderedServiceHttpController,
  DeleteOrderedServiceHttpController,
  FindOrderedServiceHttpController,
]
const commandHandlers: Provider[] = [
  CreateOrderedServiceService,
  UpdateOrderedServiceService,
  DeleteOrderedServiceService,
]
const queryHandlers: Provider[] = [FindOrderedServiceQueryHandler]
const eventHandlers: Provider[] = []
const repositories: Provider[] = [{ provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository }]
const mappers: Provider[] = [OrderedServiceMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class OrderedServiceModule {}
