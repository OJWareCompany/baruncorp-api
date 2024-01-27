import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { FindIntegratedOrderModificationHistoryHttpController } from './queries/find-integrated-order-modification-history/find-integrated-order-modification-history.http.controller'
import { FindIntegratedOrderModificationHistoryPaginatedHttpController } from './queries/find-integrated-order-modification-history-paginated/find-integrated-order-modification-history.paginated.http.controller'
import { FindIntegratedOrderModificationHistoryQueryHandler } from './queries/find-integrated-order-modification-history/find-integrated-order-modification-history.query-handler'
import { FindIntegratedOrderModificationHistoryPaginatedQueryHandler } from './queries/find-integrated-order-modification-history-paginated/find-integrated-order-modification-history.paginated.query-handler'
import { OrderModificationHistoryGenerator } from './domain/domain-services/order-modification-history-generator.domain-service'
import { OrderModificationInterceptor } from './domain/domain-services/order-modification.interceptor'
import { UsersModule } from '../users/users.module'
import { JobModule } from '../ordered-job/job.module'

const httpControllers = [
  FindIntegratedOrderModificationHistoryHttpController,
  FindIntegratedOrderModificationHistoryPaginatedHttpController,
]
const commandHandlers: Provider[] = []
const queryHandlers: Provider[] = [
  FindIntegratedOrderModificationHistoryQueryHandler,
  FindIntegratedOrderModificationHistoryPaginatedQueryHandler,
]
const repositories: Provider[] = []
const eventHandlers: Provider[] = []
const mappers: Provider[] = [UserMapper]
const domainServices: Provider[] = [OrderModificationHistoryGenerator]
const interceptors: Provider[] = [OrderModificationInterceptor]
@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule), forwardRef(() => JobModule)],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    ...repositories,
    ...mappers,
    ...domainServices,
    ...interceptors,
  ],
  controllers: [...httpControllers],
  exports: [...domainServices],
})
export class IntegratedOrderModificationHistoryModule {}
