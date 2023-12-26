import { Module, Provider } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { OrganizationModule } from '../organization/organization.module'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { SignUpHttpController } from './commands/sign-up.http.controller'
import { CqrsModule } from '@nestjs/cqrs'
import { SignUpService } from './commands/sign-up.service'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepository } from '../organization/database/organization.repository'
import { InvitationMailRepository } from '../users/database/invitationMail.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { OrganizationMapper } from '../organization/organization.mapper'

const { JWT_EXPIRED_TIME } = process.env
const controllers: any[] = [AuthenticationController, SignUpHttpController]
const commandHandlers: Provider[] = [SignUpService, AuthenticationService]
const mappers: Provider[] = [UserMapper, UserRoleMapper, OrganizationMapper]
const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: ORGANIZATION_REPOSITORY,
    useClass: OrganizationRepository,
  },

  {
    provide: INVITATION_MAIL_REPOSITORY,
    useClass: InvitationMailRepository,
  },
]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    UsersModule,
    OrganizationModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: JWT_EXPIRED_TIME },
    }),
  ],
  providers: [...commandHandlers, ...mappers, ...repositories],
  controllers: [...controllers],
})
export class AuthenticationModule {}
