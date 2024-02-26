import { CqrsModule } from '@nestjs/cqrs'
import { Module, Provider, forwardRef } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { UsersController } from './users.controller'
import { UserService } from './users.service'
import { PrismaModule } from '../database/prisma.module'
import { UserRepository } from './database/user.repository'
import { InvitationMailRepository } from './database/invitationMail.repository'
import UserMapper from './user.mapper'
import { UserRoleMapper } from './user-role.mapper'
import { OrganizationMapper } from '../organization/organization.mapper'
import { CreateUserHttpContoller } from './commands/create-user/create-user.http.controller'
import { CreateUserService } from './commands/create-user/create-user.service'
import { FindUsersHttpController } from './queries/find-users/find-user.http.controller'
import { FindUserQueryHandler } from './queries/find-users/find-user.query-handler'
import { AppointUserLicenseHttpController } from './commands/appoint-user-license/appoint-user-license.http.controller'
import { RevokeUserLicenseHttpController } from './commands/revoke-user-license/revoke-user-license.http.controller'
import { AppointUserLicenseService } from './commands/appoint-user-license/appoint-user-license.service'
import { RevokeUserLicenseService } from './commands/revoke-user-license/revoke-user-license.service'
import { AddAvailableTaskHttpController } from './commands/add-available-task/add-available-task.http.controller'
import { AddAvailableTaskService } from './commands/add-available-task/add-available-task.service'
import { DeleteAvailableTaskHttpController } from './commands/delete-available-task/delete-available-task.http.controller'
import { DeleteAvailableTaskService } from './commands/delete-available-task/delete-available-task.service'
import { ModifyAssignmentTypeOfAvailableTaskHttpController } from './commands/modify-assignment-type-of-available-task/modify-assignment-type-of-available-task.http.controller'
import { ModifyAssignmentTypeOfAvailableTaskService } from './commands/modify-assignment-type-of-available-task/modify-assignment-type-of-available-task.service'
import { HandsDownHttpController } from './commands/hands-down/hands-down.http.controller'
import { HandsUpHttpController } from './commands/hands-up/hands-up.http.controller'
import { CheckHandsStatusHttpController } from './queries/check-hands-state/check-hands-state.http.controller'
import { HandsDownService } from './commands/hands-down/hands-down.service'
import { HandsUpService } from './commands/hands-up/hands-up.service'
import { InviteHttpController } from './commands/invite/invite.http.controller'
import { InviteService } from './commands/invite/invite.service'
import { ResetDefaultTasksHttpController } from './commands/reset-default-tasks/reset-default-tasks.http.controller'
import { ResetDefaultTasksService } from './commands/reset-default-tasks/reset-default-tasks.service'
import { CheckInvitedUserHttpController } from './queries/check-invited-user/check-invited-user.http.controller'
import { ReactivateUserHttpController } from './commands/reactivate-user/reactivate-user.http.controller'
import { DeactivateUserHttpController } from './commands/deactivate-user/deactivate-user.http.controller'
import { ReactivateUserService } from './commands/reactivate-user/reactivate-user.service'
import { DeactivateUserService } from './commands/deactivate-user/deactivate-user.service'
import { UserManager } from './domain/domain-services/user-manager.domain-service'
import { ChangeUserRoleService } from './commands/change-user-role/change-user-role.service'
import { ChangeUserRoleHttpController } from './commands/change-user-role/change-user-role.http.controller'
import { InvoiceModule } from '../invoice/invoice.module'
import { JobModule } from '../ordered-job/job.module'
import { OrganizationModule } from '../organization/organization.module'
import { AssignedTaskModule } from '../assigned-task/assigned-task.module'
import { PositionModule } from '../position/position.module'
import { PtoModule } from '../pto/pto.module'

const httpControllers = [
  UsersController,
  CreateUserHttpContoller,
  FindUsersHttpController,
  AppointUserLicenseHttpController,
  RevokeUserLicenseHttpController,
  AddAvailableTaskHttpController,
  DeleteAvailableTaskHttpController,
  ModifyAssignmentTypeOfAvailableTaskHttpController,
  HandsDownHttpController,
  HandsUpHttpController,
  CheckHandsStatusHttpController,
  InviteHttpController,
  ResetDefaultTasksHttpController,
  CheckInvitedUserHttpController,
  ReactivateUserHttpController,
  DeactivateUserHttpController,
  ChangeUserRoleHttpController,
]
const commandHandlers: Provider[] = [
  CreateUserService,
  AppointUserLicenseService,
  RevokeUserLicenseService,
  AddAvailableTaskService,
  DeleteAvailableTaskService,
  ModifyAssignmentTypeOfAvailableTaskService,
  HandsDownService,
  HandsUpService,
  InviteService,
  ResetDefaultTasksService,
  ReactivateUserService,
  DeactivateUserService,
  ChangeUserRoleService,
]
const queryHandlers: Provider[] = [FindUserQueryHandler]
const domainServices: Provider[] = [UserManager]

const repositories: Provider[] = [
  { provide: INVITATION_MAIL_REPOSITORY, useClass: InvitationMailRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]

const mappers: Provider[] = [UserMapper, UserRoleMapper]

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    forwardRef(() => OrganizationModule),
    forwardRef(() => JobModule),
    forwardRef(() => AssignedTaskModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => PositionModule),
    forwardRef(() => PtoModule),
  ],
  providers: [UserService, ...commandHandlers, ...queryHandlers, ...repositories, ...mappers, ...domainServices],
  controllers: [...httpControllers],
  exports: [UserService, ...repositories, ...mappers, ...domainServices],
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
