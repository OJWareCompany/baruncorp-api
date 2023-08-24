import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './libs/exceptions/http-exception.filter'
import { AuthenticationModule } from './modules/auth/authentication.module'
import { UsersModule } from './modules/users/users.module'
import { OrganizationModule } from './modules/organization/organization.module'
import { DepartmentModule } from './modules/department/department.module'
import { GeographyModule } from './modules/geography/geography.module'
import { ProjectModule } from './modules/project/project.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JobModule } from './modules/ordered-job/job.module'
import { OrderedTaskModule } from './modules/ordered-task/ordered-task.module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthenticationModule,
    UsersModule,
    OrganizationModule,
    DepartmentModule,
    GeographyModule,
    ProjectModule,
    JobModule,
    OrderedTaskModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
