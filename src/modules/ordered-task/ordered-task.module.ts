import { Module, Provider } from '@nestjs/common'
import { CreateOrderedTaskWhenJobIsCreatedDomainEventHandler } from './application/event-handlers/create-orderd-task-when-job-is-created.domain-event-handler'
import { ORDERED_TASK_REPOSITORY } from './ordered-task.di-token'
import { OrderedTaskRepository } from './database/ordered-task.repository'
import { PrismaModule } from '../database/prisma.module'
import { OrderedTaskMapper } from './ordered-task.mapper'
import { UpdateOrderedTaskWhenJobIsUpdatedDomainEventHandler } from './application/event-handlers/update-ordered-task-when-job-is-updated.domain-event-handler'

const eventHandlers: Provider[] = [
  CreateOrderedTaskWhenJobIsCreatedDomainEventHandler,
  UpdateOrderedTaskWhenJobIsUpdatedDomainEventHandler,
]

const mappers: Provider[] = [OrderedTaskMapper]

const repositories: Provider[] = [{ provide: ORDERED_TASK_REPOSITORY, useClass: OrderedTaskRepository }]

@Module({
  imports: [PrismaModule],
  providers: [...repositories, ...mappers, ...eventHandlers],
  controllers: [],
  exports: [],
})
export class OrderedTaskModule {}
