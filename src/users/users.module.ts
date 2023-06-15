import { Module, Provider } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { UsersController } from './users.controller'
import { UserService } from './users.service'
import { PrismaModule } from '../database/prisma.module'
import { UserRepository } from './database/user.repository'
import { InvitationMailRepository } from './database/invitationMail.repository'

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: INVITATION_MAIL_REPOSITORY, useClass: InvitationMailRepository },
]

@Module({
  imports: [PrismaModule],
  providers: [UserService, ...repositories],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
