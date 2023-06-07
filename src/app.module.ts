import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthenticationController } from './auth/authentication.controller'
import { AuthenticationService } from './auth/authentication.service'
import { AuthenticationModule } from './auth/authentication.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [AuthenticationModule, UsersModule],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
