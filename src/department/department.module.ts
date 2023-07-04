import { Module, Provider } from '@nestjs/common'
import { DepartmentController } from './department.controller'
import { DepartmentService } from './department.service'
import { DEPARTMENT_REPOSITORY } from './department.di-token'
import { DepartmentRepository } from './database/department.repository'
import { PrismaModule } from '../database/prisma.module'
import { LicenseMapper } from './license.mapper'
import { PositionMapper } from './position.mapper'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import UserMapper from '../users/user.mapper'
import { UserRoleMapper } from '../users/user-role.mapper'
import { ServiceMapper } from './service.mapper'

const repositories: Provider[] = [
  { provide: DEPARTMENT_REPOSITORY, useClass: DepartmentRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]

const mappers: Provider[] = [UserMapper, LicenseMapper, PositionMapper, UserRoleMapper, ServiceMapper]

@Module({
  imports: [PrismaModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, ...repositories, ...mappers],
})
export class DepartmentModule {}
