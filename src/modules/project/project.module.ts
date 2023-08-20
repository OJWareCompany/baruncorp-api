import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { SearchCensusHttpController } from './commands/create-ahj-note/search-census.http.controller'
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
import { SearchCensusService } from './commands/create-ahj-note/search-census.service'
import { FindUsersHttpController } from './queries/find-projects/find-projects.http.controller'
import { FindProjectsQueryHandler } from './queries/find-projects/find-projects.query-handler'

const commandHandlers: Provider[] = [SearchCensusService, CreateProjectService]

const repositories: Provider[] = [
  { provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository },
  { provide: PROJECT_REPOSITORY, useClass: ProjectRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]

const queryHandlers: Provider[] = [FindProjectsQueryHandler]

// 얘네는 왜 세트인가? UserMapper, UserRoleMapper, LicenseMapper
const mappers: Provider[] = [ProjectMapper, UserMapper, UserRoleMapper, LicenseMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [SearchCensusHttpController, CreateProjectHttpController, FindUsersHttpController],
})
export class ProjectModule {}
