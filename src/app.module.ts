import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AuthenticationModule } from './auth/authentication.module'
import { UsersModule } from './users/users.module'
import { OrganizationModule } from './organization/organization.module'
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter'
import { DepartmentModule } from './department/department.module'

@Module({
  imports: [AuthenticationModule, UsersModule, OrganizationModule, DepartmentModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
