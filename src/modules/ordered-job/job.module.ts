import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateJobHttpController } from './commands/create-job/create-job.http.controller'
import { JOB_REPOSITORY } from './job.di-token'
import { JobRepository } from './database/job.repository'
import { CreateJobService } from './commands/create-job/create-job.service'
import { JobMapper } from './job.mapper'
import { PrismaModule } from '../database/prisma.module'
import { AuthenticationModule } from '../auth/authentication.module'
import { UpdateJobHttpController } from './commands/update-job/update-job.http.controller'
import { UpdateJobService } from './commands/update-job/update-job.service'
import { FindJobQueryHandler } from './queries/find-job/find-job.query-handler'
import { FindJobHttpController } from './queries/find-job/find-job.http.controller'
import { FindJobPaginatedHttpController } from './queries/find-job-paginated/find-job.paginated.http.controller'
import { FindJobPaginatedQueryHandler } from './queries/find-job-paginated/find-job.paginated.query-handler'
import { DeleteJobHttpController } from './commands/delete-job/delete-job.http.controller'
import { DeleteJobService } from './commands/delete-job/delete-job.service'
import UserMapper from '../users/user.mapper'
import { FindMyActiveJobPaginatedHttpController } from './queries/find-my-active-jobs/find-my-active-job.paginated.http.controller'
import { FindMyActiveJobPaginatedQueryHandler } from './queries/find-my-active-jobs/find-my-active-job.paginated.query-handler'
import { UpdateJobWhenTaskIsUpdatedDomainEventHandler } from './application/event-handlers/update-job-when-task-is-updated.domain-event-handler'

const httpControllers = [
  CreateJobHttpController,
  UpdateJobHttpController,
  DeleteJobHttpController,
  FindJobHttpController,
  FindJobPaginatedHttpController,
  FindMyActiveJobPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateJobService, UpdateJobService, DeleteJobService]
const queryHandlers: Provider[] = [
  FindJobQueryHandler,
  FindJobPaginatedQueryHandler,
  FindMyActiveJobPaginatedQueryHandler,
]
const eventHandlers: Provider[] = [UpdateJobWhenTaskIsUpdatedDomainEventHandler]
const repositories: Provider[] = [{ provide: JOB_REPOSITORY, useClass: JobRepository }]

const mappers: Provider[] = [JobMapper, UserMapper]

@Module({
  imports: [PrismaModule, CqrsModule, AuthenticationModule],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class JobModule {}
