import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreateTaskHttpController } from './commands/create-task/create-task.http.controller'
import { UpdateTaskHttpController } from './commands/update-task/update-task.http.controller'
import { DeleteTaskHttpController } from './commands/delete-task/delete-task.http.controller'
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

const httpControllers = [
  CreateTaskHttpController,
  UpdateTaskHttpController,
  DeleteTaskHttpController,
  FindTaskHttpController,
  FindTaskPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateTaskService, UpdateTaskService, DeleteTaskService]
const queryHandlers: Provider[] = [FindTaskQueryHandler, FindTaskPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: TASK_REPOSITORY,
    useClass: TaskRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [TaskMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class TaskModule {}
