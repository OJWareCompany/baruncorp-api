import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { SearchCensusHttpController } from './commands/create-ahj-note/create-ahj-note.http.controller'
import { PrismaModule } from '../database/prisma.module'
import { GEOGRAPHY_REPOSITORY } from '../geography/geography.di-token'
import { GeographyRepository } from '../geography/database/geography.repository'
import { CreateProjectHttpController } from './commands/create-project/create-project.http.controller'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import UserMapper from '../users/user.mapper'
import { ProjectMapper } from './project.mapper'
import { UserRoleMapper } from '../users/user-role.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { CreateProjectService } from './commands/create-project/create-project.service'
import { PROJECT_REPOSITORY } from './project.di-token'
import { ProjectRepository } from './database/project.repository'
import { SearchCensusService } from './commands/create-ahj-note/create-ahj-note.service'
import { FindProjectsHttpController } from './queries/find-projects/find-projects.http.controller'
import { FindProjectsQueryHandler } from './queries/find-projects/find-projects.query-handler'
import { FindProjectDetailHttpController } from './queries/find-project-detail/find-project-detail.http.controller'
import { FindProjectDetailQueryHandler } from './queries/find-project-detail/find-project-detail.query-handler'
import { UpdateProjectWhenJobIsCreatedEventHandler } from './application/event-handlers/update-project-when-job-is-created.domain-event-handler'
import { UpdateProjectWhenCurrentJobIsUpdatedEventHandler } from './application/event-handlers/update-project-when-current-job-is-updated.domain-event-handler'
import { DeleteProjectService } from './commands/delete-project/delete-project.service'
import { DeleteProjectHttpController } from './commands/delete-project/delete-project.http.controller'
import { UpdateProjectHttpController } from './commands/update-project/update-project.http.controller'
import { UpdateProjectService } from './commands/update-project/update-project.service'
import { JobMapper } from '../ordered-job/job.mapper'
import { JOB_REPOSITORY } from '../ordered-job/job.di-token'
import { JobRepository } from '../ordered-job/database/job.repository'
import { CensusSearchCoordinatesService } from './infra/census/census.search.coordinates.request.dto'

const httpControllers = [
  SearchCensusHttpController,
  CreateProjectHttpController,
  UpdateProjectHttpController,
  DeleteProjectHttpController,
  FindProjectsHttpController,
  FindProjectDetailHttpController,
]

const providers: Provider[] = [CensusSearchCoordinatesService]

const commandHandlers: Provider[] = [
  SearchCensusService,
  CreateProjectService,
  UpdateProjectService,
  DeleteProjectService,
]

const eventHandlers: Provider[] = [
  UpdateProjectWhenJobIsCreatedEventHandler,
  UpdateProjectWhenCurrentJobIsUpdatedEventHandler,
]

const queryHandlers: Provider[] = [FindProjectsQueryHandler, FindProjectDetailQueryHandler]

const repositories: Provider[] = [
  { provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository },
  { provide: PROJECT_REPOSITORY, useClass: ProjectRepository },
  { provide: JOB_REPOSITORY, useClass: JobRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]

// 얘네는 왜 세트인가? UserMapper, UserRoleMapper, LicenseMapper
const mappers: Provider[] = [ProjectMapper, JobMapper, UserMapper, UserRoleMapper, LicenseMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers, ...providers],
  controllers: [...httpControllers],
})
export class ProjectModule {}
