import { Module, Provider } from '@nestjs/common'
import { AssigningTaskAlertGateway } from './assigning-task-alert.gateway'
import { PrismaModule } from '../database/prisma.module'
import { AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/alert-when-task-is-assigned.domain-event-handler'
import { AssigningTaskAlertRepository } from './database/assigning-task-alert.repository'
import { ASSIGNING_TASK_ALERT_REPOSITORY } from './assigning-task-alert.di-token'
import { AssigningTaskAlertsMapper } from './assigning-task-alert.mapper'
import { CqrsModule } from '@nestjs/cqrs'
import { FindAssigningTaskAlertPaginatedHttpController } from './queries/find-assigning-task-alert-paginated/find-assigning-task-alert.paginated.http.controller'
import { FindAssigningTaskAlertPaginatedQueryHandler } from './queries/find-assigning-task-alert-paginated/find-assigning-task-alert.paginated.query-handler'
import { CheckOutAssigningTaskAlertHttpController } from './command/check-out-assigning-task-alert/check-out-assigning-task-alert.http.controller'
import { CheckOutAssigningTaskAlertCommandHandler } from './command/check-out-assigning-task-alert/check-out-assigning-task-alert.service'
import { UsersModule } from '../users/users.module'

const controllers = [FindAssigningTaskAlertPaginatedHttpController, CheckOutAssigningTaskAlertHttpController]
const eventHandlers: Provider[] = [AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler]
const commandHandlers: Provider[] = [CheckOutAssigningTaskAlertCommandHandler]
const queryHandlers: Provider[] = [FindAssigningTaskAlertPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    useClass: AssigningTaskAlertRepository,
    provide: ASSIGNING_TASK_ALERT_REPOSITORY,
  },
]
const mappers: Provider[] = [AssigningTaskAlertsMapper]
const gateways: Provider[] = [AssigningTaskAlertGateway]

@Module({
  imports: [CqrsModule, PrismaModule, UsersModule],
  providers: [...gateways, ...mappers, ...eventHandlers, ...repositories, ...queryHandlers, ...commandHandlers],
  controllers: [...controllers],
})
export class AssigningTaskAlertModule {}
