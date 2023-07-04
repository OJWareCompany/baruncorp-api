import { Module, Provider } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { OrganizationModule } from '../organization/organization.module'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import UserMapper from '../users/user.mapper'
import { PrismaModule } from '../database/prisma.module'
import { UserRoleMapper } from '../users/user-role.mapper'

const { JWT_EXPIRED_TIME } = process.env

const repositories: Provider[] = [{ provide: USER_REPOSITORY, useClass: UserRepository }]
const mappers: Provider[] = [UserMapper, UserRoleMapper]

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    OrganizationModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: JWT_EXPIRED_TIME },
    }),
  ],
  providers: [AuthenticationService, ...repositories, ...mappers],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
