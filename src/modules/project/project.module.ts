import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { SearchCensusHttpController } from './commands/create-ahj-note/create-ahj-note.http.controller'
import { PrismaModule } from '../database/prisma.module'
import { CreateProjectHttpController } from './commands/create-project/create-project.http.controller'
import { ProjectMapper } from './project.mapper'
import { CreateProjectService } from './commands/create-project/create-project.service'
import { PROJECT_REPOSITORY } from './project.di-token'
import { ProjectRepository } from './database/project.repository'
import { CreateAhjNoteService } from './commands/create-ahj-note/create-ahj-note.service'
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
import { CensusSearchCoordinatesService } from './infra/census/census.search.coordinates.request.dto'
import { ProjectValidatorDomainService } from './domain/domain-services/project-validator.domain-service'
import { GeographyModule } from '../geography/geography.module'
import { JobModule } from '../ordered-job/job.module'
import { UsersModule } from '../users/users.module'
import { OrganizationModule } from '../organization/organization.module'

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
  CreateAhjNoteService,
  CreateProjectService,
  UpdateProjectService,
  DeleteProjectService,
]

const eventHandlers: Provider[] = [
  UpdateProjectWhenJobIsCreatedEventHandler,
  UpdateProjectWhenCurrentJobIsUpdatedEventHandler,
]

const queryHandlers: Provider[] = [FindProjectsQueryHandler, FindProjectDetailQueryHandler]

const repositories: Provider[] = [{ provide: PROJECT_REPOSITORY, useClass: ProjectRepository }]

const mappers: Provider[] = [ProjectMapper]

const domainServices: Provider[] = [ProjectValidatorDomainService]

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    GeographyModule,
    OrganizationModule,
    forwardRef(() => JobModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    ...queryHandlers,
    ...repositories,
    ...mappers,
    ...providers,
    ...domainServices,
  ],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class ProjectModule {}
