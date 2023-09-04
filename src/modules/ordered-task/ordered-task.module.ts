import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import UserMapper from '../users/user.mapper'
import { OrderedTaskMapper } from './ordered-task.mapper'
import { PrismaModule } from '../database/prisma.module'
import { ORDERED_TASK_REPOSITORY } from './ordered-task.di-token'
import { OrderedTaskRepository } from './database/ordered-task.repository'
import { CreateOrderedTaskWhenJobIsCreatedDomainEventHandler } from './application/event-handlers/create-orderd-task-when-job-is-created.domain-event-handler'
import { UpdateOrderedTaskWhenJobIsUpdatedDomainEventHandler } from './application/event-handlers/update-ordered-task-when-job-is-updated.domain-event-handler'
import { CreateOrderedTaskHttpController } from './commands/create-ordered-task/create-ordered-task.http.controller'
import { CreateOrderedTaskService } from './commands/create-ordered-task/create-ordered-task.service'

const httpControllers = [CreateOrderedTaskHttpController]

const commandHandlers: Provider[] = [CreateOrderedTaskService]

const eventHandlers: Provider[] = [
  CreateOrderedTaskWhenJobIsCreatedDomainEventHandler,
  UpdateOrderedTaskWhenJobIsUpdatedDomainEventHandler,
]

const mappers: Provider[] = [OrderedTaskMapper, UserMapper]

const repositories: Provider[] = [{ provide: ORDERED_TASK_REPOSITORY, useClass: OrderedTaskRepository }]

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...commandHandlers, ...repositories, ...mappers, ...eventHandlers],
  controllers: [...httpControllers],
  exports: [],
})
export class OrderedTaskModule {}
