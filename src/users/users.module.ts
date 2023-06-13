import { Module, Provider } from '@nestjs/common'
import { INVITATION_MAIL_REPOSITORY, USER_REPOSITORY } from './user.di-tokens'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PrismaModule } from '../database/prisma.module'
import { UserRepository } from './database/user.repository'
import { InvitationMailRepository } from './database/invitationMail.repository'

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: INVITATION_MAIL_REPOSITORY, useClass: InvitationMailRepository },
]

@Module({
  imports: [PrismaModule],
  providers: [UsersService, ...repositories],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
