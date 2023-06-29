import { Module, Provider } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { UsersController } from './users.controller'
import { UserService } from './users.service'
import { PrismaModule } from '../database/prisma.module'
import { UserRepository } from './database/user.repository'
import { InvitationMailRepository } from './database/invitationMail.repository'
import { ORGANIZATION_REPOSITORY } from '../organization/organization.di-token'
import { OrganizationRepository } from '../organization/database/organization.repository'

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: INVITATION_MAIL_REPOSITORY, useClass: InvitationMailRepository },
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
]

@Module({
  imports: [PrismaModule],
  providers: [UserService, ...repositories],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
