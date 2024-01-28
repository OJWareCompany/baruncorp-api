import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { AopModule } from '@toss/nestjs-aop'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { UsersModule } from '../users/users.module'
import { JobModule } from '../ordered-job/job.module'
import { FindIntegratedOrderModificationHistoryPaginatedHttpController } from './queries/find-integrated-order-modification-history-paginated/find-integrated-order-modification-history.paginated.http.controller'
import { FindIntegratedOrderModificationHistoryPaginatedQueryHandler } from './queries/find-integrated-order-modification-history-paginated/find-integrated-order-modification-history.paginated.query-handler'
import { FindIntegratedOrderModificationHistoryHttpController } from './queries/find-integrated-order-modification-history/find-integrated-order-modification-history.http.controller'
import { FindIntegratedOrderModificationHistoryQueryHandler } from './queries/find-integrated-order-modification-history/find-integrated-order-modification-history.query-handler'
import { OrderedScopeModificationHistoryDecorator } from './domain/domain-services/ordered-scope-modification-history.decorator'
import { AssignedTaskModificationHistoryDecorator } from './domain/domain-services/assignd-task-modification-history.decorator'
import { OrderModificationHistoryGenerator } from './domain/domain-services/order-modification-history-generator.domain-service'
import { JobModificationHistoryDecorator } from './domain/domain-services/job-modification-history.decorator'
import { OrderedServiceModule } from '../ordered-service/ordered-service.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'

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
const decorators: Provider[] = [
  JobModificationHistoryDecorator,
  OrderedScopeModificationHistoryDecorator,
  AssignedTaskModificationHistoryDecorator,
]

@Module({
  imports: [
    AopModule,
    CqrsModule,
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => JobModule),
    forwardRef(() => OrderedServiceModule),
    forwardRef(() => AssignedTaskModule),
  ],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    ...repositories,
    ...mappers,
    ...domainServices,
    ...decorators,
  ],
  controllers: [...httpControllers],
  exports: [...domainServices, ...decorators],
})
export class IntegratedOrderModificationHistoryModule {}
