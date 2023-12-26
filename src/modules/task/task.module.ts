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
import { AddPrerequisiteTaskHttpController } from './commands/add-prerequisite-task/add-prerequisite-task.http.controller'
import { DeletePrerequisiteTaskHttpController } from './commands/delete-prerequisite-task/delete-prerequisite-task.http.controller'
import { AddPrerequisiteTaskService } from './commands/add-prerequisite-task/add-prerequisite-task.service'
import { DeletePrerequisiteTaskService } from './commands/delete-prerequisite-task/delete-prerequisite-task.service'
import { UpdatePositionOrderHttpController } from './commands/update-position-order/update-position-order.http.controller'
import { UpdatePositionOrderService } from './commands/update-position-order/update-position-order.service'
import { FindUnregisteredUsersForTaskHttpController } from './queries/find-unregistered-users-for-task/find-unregistered-users-for-task.http.controller'
import { FindUnregisteredUsersForTaskPaginatedQueryHandler } from './queries/find-unregistered-users-for-task/find-unregistered-users-for-task.query-handler'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { PositionRepository } from '../position/database/position.repository'
import { POSITION_REPOSITORY } from '../position/position.di-token'
import { PositionMapper } from '../position/position.mapper'

const httpControllers = [
  CreateTaskHttpController,
  UpdateTaskHttpController,
  // DeleteTaskHttpController,
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
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: POSITION_REPOSITORY,
    useClass: PositionRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [TaskMapper, UserMapper, UserRoleMapper, PositionMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class TaskModule {}
