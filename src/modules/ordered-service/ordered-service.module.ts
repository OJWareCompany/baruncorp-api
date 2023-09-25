import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../../../src/modules/database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreateOrderedServiceHttpController } from './command/create-ordered-service/create-ordered-service.http.controller'
import { CreateOrderedServiceService } from './command/create-ordered-service/create-ordered-service.service'
import { ORDERED_SERVICE_REPOSITORY } from './ordered-service.di-token'
import { OrderedServiceRepository } from './database/ordered-service.repository'
import { OrderedServiceMapper } from './ordered-service.mapper'

const httpControllers = [CreateOrderedServiceHttpController]
const commandHandlers: Provider[] = [CreateOrderedServiceService]
const eventHandlers: Provider[] = []
const queryHandlers: Provider[] = []
const repositories: Provider[] = [{ provide: ORDERED_SERVICE_REPOSITORY, useClass: OrderedServiceRepository }]
const mappers: Provider[] = [OrderedServiceMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class OrderedServiceModule {}
