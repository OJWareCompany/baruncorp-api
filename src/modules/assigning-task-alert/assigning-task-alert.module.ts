import { Module, Provider } from '@nestjs/common'
import { AssigningTaskAlertGateway } from './assigning-task-alert.gateway'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/alert-when-task-is-assigned.domain-event-handler'
import { AssigningTaskAlertRepository } from './database/assigning-task-alert.repository'
import { ASSIGNING_TASK_ALERT_REPOSITORY } from './assigning-task-alert.di-token'
import { AssigningTaskAlertsMapper } from './assigning-task-alert.mapper'
import { CqrsModule } from '@nestjs/cqrs'
import { FindAssigningTaskAlertPaginatedHttpController } from './queries/find-assigning-task-alert-paginated/find-assigning-task-alert.paginated.http.controller'
import { FindAssigningTaskAlertPaginatedQueryHandler } from './queries/find-assigning-task-alert-paginated/find-assigning-task-alert.paginated.query-handler'

const controllers = [FindAssigningTaskAlertPaginatedHttpController]
const eventHandlers: Provider[] = [AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler]
const queryHandlers: Provider[] = [FindAssigningTaskAlertPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    useClass: AssigningTaskAlertRepository,
    provide: ASSIGNING_TASK_ALERT_REPOSITORY,
  },
]
const mappers: Provider[] = [UserMapper, AssigningTaskAlertsMapper]
const gateways: Provider[] = [AssigningTaskAlertGateway]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...gateways, ...mappers, ...eventHandlers, ...repositories, ...queryHandlers],
  controllers: [...controllers],
})
export class AssigningTaskAlertModule {}
