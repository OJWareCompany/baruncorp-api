import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreateDepartmentHttpController } from './commands/create-department/create-department.http.controller'
import { UpdateDepartmentHttpController } from './commands/update-department/update-department.http.controller'
import { DeleteDepartmentHttpController } from './commands/delete-department/delete-department.http.controller'
import { FindDepartmentHttpController } from './queries/find-department/find-department.http.controller'
import { FindDepartmentPaginatedHttpController } from './queries/find-department-paginated/find-department.paginated.http.controller'
import { CreateDepartmentService } from './commands/create-department/create-department.service'
import { UpdateDepartmentService } from './commands/update-department/update-department.service'
import { DeleteDepartmentService } from './commands/delete-department/delete-department.service'
import { FindDepartmentQueryHandler } from './queries/find-department/find-department.query-handler'
import { FindDepartmentPaginatedQueryHandler } from './queries/find-department-paginated/find-department.paginated.query-handler'
import { DEPARTMENT_REPOSITORY } from './department.di-token'
import { DepartmentRepository } from './database/department.repository'
import { DepartmentMapper } from './department.mapper'
import { AddUserHttpController } from './commands/add-user/add-user.http.controller'
import { AddUserService } from './commands/add-user/add-user.service'
import { UsersModule } from '../users/users.module'
import { AddUserToDepartment } from './domain/domain-services/add-user-to-department.domain-service'
import { RemoveUserHttpController } from './commands/remove-user/remove-user.http.controller'
import { RemoveUserService } from './commands/remove-user/remove-user.service'

const httpControllers = [
  CreateDepartmentHttpController,
  UpdateDepartmentHttpController,
  DeleteDepartmentHttpController,
  FindDepartmentHttpController,
  FindDepartmentPaginatedHttpController,
  AddUserHttpController,
  RemoveUserHttpController,
]
const commandHandlers: Provider[] = [
  CreateDepartmentService,
  UpdateDepartmentService,
  DeleteDepartmentService,
  AddUserService,
  RemoveUserService,
]
const queryHandlers: Provider[] = [FindDepartmentQueryHandler, FindDepartmentPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: DEPARTMENT_REPOSITORY,
    useClass: DepartmentRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [DepartmentMapper, UserMapper]
const domainServices: Provider[] = [AddUserToDepartment]

@Module({
  imports: [CqrsModule, PrismaModule, UsersModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
})
export class DepartmentModule {}
