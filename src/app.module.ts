import { Module } from '@nestjs/common'
import { AuthenticationModule } from './auth/authentication.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [AuthenticationModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
