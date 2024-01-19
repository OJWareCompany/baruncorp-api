import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateTaskHttpController } from './commands/create-task/create-task.http.controller'
import { UpdateTaskHttpController } from './commands/update-task/update-task.http.controller'
import { FindTaskHttpController } from './queries/find-task/find-task.http.controller'
import { FindTaskPaginatedHttpController } from './queries/find-task-paginated/task.paginated.http.controller'
import { CreateTaskService } from './commands/create-task/create-task.service'
import { UpdateTaskService } from './commands/update-task/update-task.service'
import { DeleteTaskService } from './commands/delete-task/delete-task.service'
import { FindTaskQueryHandler } from './queries/find-task/find-task.query-handler'
import { FindTaskPaginatedQueryHandler } from './queries/find-task-paginated/task.paginated.query-handler'
import { TASK_REPOSITORY } from './task.di-token'
import { TaskRepository } from './database/task.repository'
import { TaskMapper } from './task.mapper'
import { AddPrerequisiteTaskHttpController } from './commands/add-prerequisite-task/add-prerequisite-task.http.controller'
import { DeletePrerequisiteTaskHttpController } from './commands/delete-prerequisite-task/delete-prerequisite-task.http.controller'
import { AddPrerequisiteTaskService } from './commands/add-prerequisite-task/add-prerequisite-task.service'
import { DeletePrerequisiteTaskService } from './commands/delete-prerequisite-task/delete-prerequisite-task.service'
import { UpdatePositionOrderHttpController } from './commands/update-position-order/update-position-order.http.controller'
import { UpdatePositionOrderService } from './commands/update-position-order/update-position-order.service'
import { FindUnregisteredUsersForTaskHttpController } from './queries/find-unregistered-users-for-task/find-unregistered-users-for-task.http.controller'
import { FindUnregisteredUsersForTaskPaginatedQueryHandler } from './queries/find-unregistered-users-for-task/find-unregistered-users-for-task.query-handler'
import { InvoiceModule } from '../invoice/invoice.module'
import { JobModule } from '../ordered-job/job.module'
import { UsersModule } from '../users/users.module'
import { PositionModule } from '../position/position.module'

const httpControllers = [
  CreateTaskHttpController,
  UpdateTaskHttpController,
  FindTaskHttpController,
  FindTaskPaginatedHttpController,
  AddPrerequisiteTaskHttpController,
  DeletePrerequisiteTaskHttpController,
  UpdatePositionOrderHttpController,
  FindUnregisteredUsersForTaskHttpController,
]
const commandHandlers: Provider[] = [
  CreateTaskService,
  UpdateTaskService,
  DeleteTaskService,
  AddPrerequisiteTaskService,
  DeletePrerequisiteTaskService,
  UpdatePositionOrderService,
]
const queryHandlers: Provider[] = [
  FindTaskQueryHandler,
  FindTaskPaginatedQueryHandler,
  FindUnregisteredUsersForTaskPaginatedQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: TASK_REPOSITORY,
    useClass: TaskRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [TaskMapper]
const domainServices: Provider[] = []

@Module({
  imports: [CqrsModule, PrismaModule, InvoiceModule, JobModule, UsersModule, PositionModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class TaskModule {}
