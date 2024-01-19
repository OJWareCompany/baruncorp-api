import { Module, Provider } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CqrsModule } from '@nestjs/cqrs'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { SignUpHttpController } from './commands/sign-up.http.controller'
import { SignUpService } from './commands/sign-up.service'
import { jwtConstants } from './constants'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import { OrganizationModule } from '../organization/organization.module'

const { JWT_EXPIRED_TIME } = process.env
const controllers: any[] = [AuthenticationController, SignUpHttpController]
const commandHandlers: Provider[] = [SignUpService, AuthenticationService]
const mappers: Provider[] = []
const repositories: Provider[] = []

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
    UsersModule,
    OrganizationModule,
  ],
  providers: [...commandHandlers, ...mappers, ...repositories],
  controllers: [...controllers],
})
export class AuthenticationModule {}
