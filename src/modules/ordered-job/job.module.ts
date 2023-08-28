import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateJobHttpClient } from './commands/create-job/create-job.http.controller'
import { JOB_REPOSITORY } from './job.di-token'
import { JobRepository } from './database/job.repository'
import { CreateJobService } from './commands/create-job/create-job.service'
import { JobMapper } from './job.mapper'
import { PrismaModule } from '../database/prisma.module'
import { AuthenticationModule } from '../auth/authentication.module'
import { UpdateJobHttpClient } from './commands/update-job/update-job.http.controller'
import { UpdateJobService } from './commands/update-job/update-job.service'

const httpControllers = [CreateJobHttpClient, UpdateJobHttpClient]
const commandHandlers: Provider[] = [CreateJobService, UpdateJobService]
const repositories: Provider[] = [{ provide: JOB_REPOSITORY, useClass: JobRepository }]
// const queryHandlers: Provider[] = [FindProjectsQueryHandler, FindProjectDetailQueryHandler]

// 얘네는 왜 세트인가? UserMapper, UserRoleMapper, LicenseMapper
const mappers: Provider[] = [JobMapper]

@Module({
  imports: [PrismaModule, CqrsModule, AuthenticationModule],
  providers: [...commandHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class JobModule {}
