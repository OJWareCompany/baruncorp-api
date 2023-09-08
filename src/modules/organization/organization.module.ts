import { Module, Provider } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationController } from './organization.controller'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationRepository } from './database/organization.repository'
import { PrismaService } from '../database/prisma.service'
import UserMapper from '../users/user.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { PositionMapper } from '../department/position.mapper'
import { DEPARTMENT_REPOSITORY } from '../department/department.di-token'
import { DepartmentRepository } from '../department/database/department.repository'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { OrganizationMapper } from './organization.mapper'
import { ServiceMapper } from '../department/service.mapper'
import { CreateOrganizationHttpController } from './commands/create-organization/create-organization.controller.http'
import { CreateOrganizationService } from './commands/create-organization/create-organization.service'
import { CqrsModule } from '@nestjs/cqrs'
import { FindOrganizationHttpController } from './queries/find-organization/find-orginazation.http.controller'
import { FindOrganizationQueryHandler } from './queries/find-organization/find-orginazation.query-handler'

const httpControllers = [FindOrganizationHttpController]
const queryHandlers: Provider[] = [FindOrganizationQueryHandler]

const repositories: Provider[] = [
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
  { provide: DEPARTMENT_REPOSITORY, useClass: DepartmentRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]

const providers: Provider[] = [PrismaService, OrganizationService, CreateOrganizationService]

const mappers: Provider[] = [
  UserMapper,
  PositionMapper,
  LicenseMapper,
  UserRoleMapper,
  OrganizationMapper,
  ServiceMapper,
]

@Module({
  imports: [CqrsModule],
  providers: [...providers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [OrganizationController, CreateOrganizationHttpController, ...httpControllers],
  exports: [OrganizationService],
})
export class OrganizationModule {}
