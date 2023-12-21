import { Module, Provider } from '@nestjs/common'
import { AssigningTaskAlertGateway } from './assigning-task-alert.gateway'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler } from './application/event-handlers/alert-when-task-is-assigned.domain-event-handler'

const eventHandlers: Provider[] = [AlertAssigningTaskWhenTaskIsAssignedDomainEventHandler]
const mappers: Provider[] = [UserMapper]
@Module({
  imports: [PrismaModule],
  providers: [AssigningTaskAlertGateway, ...mappers, ...eventHandlers],
})
export class AssigningTaskAlertModule {}
