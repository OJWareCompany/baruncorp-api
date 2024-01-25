import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { FindIntegratedOrderModificationHistoryHttpController } from './queries/find-integrated-order-modification-history/find-integrated-order-modification-history.http.controller'
import { FindIntegratedOrderModificationHistoryPaginatedHttpController } from './queries/find-integrated-order-modification-history-paginated/find-integrated-order-modification-history.paginated.http.controller'
import { FindIntegratedOrderModificationHistoryQueryHandler } from './queries/find-integrated-order-modification-history/find-integrated-order-modification-history.query-handler'
import { FindIntegratedOrderModificationHistoryPaginatedQueryHandler } from './queries/find-integrated-order-modification-history-paginated/find-integrated-order-modification-history.paginated.query-handler'
import { INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY } from './integrated-order-modification-history.di-token'
import { IntegratedOrderModificationHistoryRepository } from './database/integrated-order-modification-history.repository'
import { IntegratedOrderModificationHistoryMapper } from './integrated-order-modification-history.mapper'

const httpControllers = [
  FindIntegratedOrderModificationHistoryHttpController,
  FindIntegratedOrderModificationHistoryPaginatedHttpController,
]
const commandHandlers: Provider[] = []
const queryHandlers: Provider[] = [
  FindIntegratedOrderModificationHistoryQueryHandler,
  FindIntegratedOrderModificationHistoryPaginatedQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: INTEGRATED_ORDER_MODIFICATION_HISTORY_REPOSITORY,
    useClass: IntegratedOrderModificationHistoryRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [IntegratedOrderModificationHistoryMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class IntegratedOrderModificationHistoryModule {}
