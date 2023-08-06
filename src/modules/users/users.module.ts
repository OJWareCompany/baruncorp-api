import { Module, Provider } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { UsersController } from './users.controller'
import { UserService } from './users.service'
import { PrismaModule } from '../database/prisma.module'
import { UserRepository } from './database/user.repository'
import { InvitationMailRepository } from './database/invitationMail.repository'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepository } from '../organization/database/organization.repository'
import UserMapper from './user.mapper'
import { UserRoleMapper } from './user-role.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { PositionMapper } from '../department/position.mapper'
import { DEPARTMENT_REPOSITORY } from '../department/department.di-token'
import { DepartmentRepository } from '../department/database/department.repository'
import { OrganizationMapper } from '../organization/organization.mapper'
import { ServiceMapper } from '../department/service.mapper'

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: INVITATION_MAIL_REPOSITORY, useClass: InvitationMailRepository },
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
  { provide: DEPARTMENT_REPOSITORY, useClass: DepartmentRepository },
]

const mappers: Provider[] = [
  UserMapper,
  PositionMapper,
  LicenseMapper,
  UserRoleMapper,
  OrganizationMapper,
  ServiceMapper,
]

@Module({
  imports: [PrismaModule],
  providers: [UserService, ...repositories, ...mappers],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}

/**
 * 폴더 구조 개선사항
 * - users.service 에서
 * - CUD는 각 커맨드 핸들러로 (service)
 * - R은 쿼리 핸들러로 (query-handler)
 * - 나머지 기능은 비슷한것끼리 묶어서 여러개의 Application Service로 나눌수 있다.
 *
 * 각 get에 필요한 dto(query,param,등) queries로 이동
 */
