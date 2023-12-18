import { CqrsModule } from '@nestjs/cqrs'
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
import { PositionMapper } from '../department/position.mapper'
import { OrganizationMapper } from '../organization/organization.mapper'
import { CreateUserHttpContoller } from './commands/create-user/create-user.http.controller'
import { CreateUserService } from './commands/create-user/create-user.service'
import { FindUsersHttpController } from './queries/find-users/find-user.http.controller'
import { FindUserQueryHandler } from './queries/find-users/find-user.query-handler'
import { AppointUserLicenseHttpController } from './commands/appoint-user-license/appoint-user-license.http.controller'
import { RevokeUserLicenseHttpController } from './commands/revoke-user-license/revoke-user-license.http.controller'
import { AppointUserLicenseService } from './commands/appoint-user-license/appoint-user-license.service'
import { RevokeUserLicenseService } from './commands/revoke-user-license/revoke-user-license.service'

const httpControllers = [
  UsersController,
  CreateUserHttpContoller,
  FindUsersHttpController,
  AppointUserLicenseHttpController,
  RevokeUserLicenseHttpController,
]
const commandHandlers: Provider[] = [CreateUserService, AppointUserLicenseService, RevokeUserLicenseService]
const queryHandlers: Provider[] = [FindUserQueryHandler]

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: INVITATION_MAIL_REPOSITORY, useClass: InvitationMailRepository },
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
]

const mappers: Provider[] = [UserMapper, PositionMapper, UserRoleMapper, OrganizationMapper]

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [UserService, ...commandHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
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
