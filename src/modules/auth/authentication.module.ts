import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { OrganizationModule } from '../organization/organization.module'
import { PrismaModule } from '../database/prisma.module'

const { JWT_EXPIRED_TIME } = process.env

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
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
