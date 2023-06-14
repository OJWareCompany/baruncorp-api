import { Module } from '@nestjs/common'
import { AuthenticationModule } from './auth/authentication.module'
import { UsersModule } from './users/users.module'
import { CompanyModule } from './company/company.module'

@Module({
  imports: [AuthenticationModule, UsersModule, CompanyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
