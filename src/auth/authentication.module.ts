import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthenticationService } from './authentication.service'
import { AuthenticationController } from './authentication.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { CompanyModule } from '../company/company.module'

@Module({
  imports: [
    UsersModule,
    CompanyModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
