import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreatePositionHttpController } from './commands/create-position/create-position.http.controller'
import { UpdatePositionHttpController } from './commands/update-position/update-position.http.controller'
import { DeletePositionHttpController } from './commands/delete-position/delete-position.http.controller'
import { FindPositionHttpController } from './queries/find-position/find-position.http.controller'
import { FindPositionPaginatedHttpController } from './queries/find-position-paginated/find-position.paginated.http.controller'
import { CreatePositionService } from './commands/create-position/create-position.service'
import { UpdatePositionService } from './commands/update-position/update-position.service'
import { DeletePositionService } from './commands/delete-position/delete-position.service'
import { FindPositionQueryHandler } from './queries/find-position/find-position.query-handler'
import { FindPositionPaginatedQueryHandler } from './queries/find-position-paginated/find-position.paginated.query-handler'
import { POSITION_REPOSITORY } from './position.di-token'
import { PositionRepository } from './database/position.repository'
import { PositionMapper } from './position.mapper'
import { AddPositionTaskHttpController } from './commands/add-position-task/add-position-task.http.controller'
import { DeletePositionTaskHttpController } from './commands/delete-position-task/delete-position-task.http.controller'
import { AddPositionTaskService } from './commands/add-position-task/add-position-task.service'
import { DeletePositionTaskService } from './commands/delete-position-task/delete-position-task.service'
import { UpdatePositionTaskAutoAssignmentTypeHttpController } from './commands/update-position-task-autoassignment-type/update-position-task-autoassignment-type.http.controller'
import { UpdatePositionTaskAutoAssignmentTypeService } from './commands/update-position-task-autoassignment-type/update-position-task-autoassignment-type.service'
import { AddPositionWorkerHttpController } from './commands/add-worker/add-position-worker.http.controller'
import { DeletePositionWorkerHttpController } from './commands/delete-position-worker/delete-position-worker.http.controller'
import { FindPositionUnRegisteredUsersHttpController } from './queries/find-position-unregistered-users/find-position-unregistered-users.http.controller'
import { FindPositionUnRegisteredUsersQueryHandler } from './queries/find-position-unregistered-users/find-position-unregistered-users.query-handler'
import { AddPositionWorkerService } from './commands/add-worker/add-position-worker.service'
import { DeletePositionWorkerService } from './commands/delete-position-worker/delete-position-worker.service'

const httpControllers = [
  CreatePositionHttpController,
  UpdatePositionHttpController,
  DeletePositionHttpController,
  FindPositionHttpController,
  FindPositionPaginatedHttpController,
  AddPositionTaskHttpController,
  DeletePositionTaskHttpController,
  UpdatePositionTaskAutoAssignmentTypeHttpController,
  AddPositionWorkerHttpController,
  DeletePositionWorkerHttpController,
  FindPositionUnRegisteredUsersHttpController,
]
const commandHandlers: Provider[] = [
  CreatePositionService,
  UpdatePositionService,
  DeletePositionService,
  AddPositionTaskService,
  DeletePositionTaskService,
  UpdatePositionTaskAutoAssignmentTypeService,
  AddPositionWorkerService,
  DeletePositionWorkerService,
]
const queryHandlers: Provider[] = [
  FindPositionQueryHandler,
  FindPositionPaginatedQueryHandler,
  FindPositionUnRegisteredUsersQueryHandler,
]
const repositories: Provider[] = [
  {
    provide: POSITION_REPOSITORY,
    useClass: PositionRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [PositionMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class PositionModule {}
