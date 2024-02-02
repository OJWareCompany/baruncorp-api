import { CqrsModule } from '@nestjs/cqrs'
import { Module, Provider } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import UserMapper from '../users/user.mapper'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { OrganizationService } from './organization.service'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationRepository } from './database/organization.repository'
import { OrganizationMapper } from './organization.mapper'
import { CreateOrganizationHttpController } from './commands/create-organization/create-organization.controller.http'
import { CreateOrganizationService } from './commands/create-organization/create-organization.service'
import { FindOrganizationHttpController } from './queries/find-organization/find-orginazation.http.controller'
import { FindOrganizationQueryHandler } from './queries/find-organization/find-orginazation.query-handler'
import { FindOrganizationPaginatedQueryHandler } from './queries/find-organization-paginated/find-organization-paginated.query-handler'
import { FindOrganizationPaginatedHttpController } from './queries/find-organization-paginated/find-organization-paginated.http.controller'
import { FindMemberPaginatedHttpController } from './queries/find-member-paginzated/find-member-paginated.http.controller'
import { FindMemberPaginatedQueryHandler } from './queries/find-member-paginzated/find-member-paginated.query-handler'
import { FindMyMemberPaginatedHttpController } from './queries/find-my-member-paginated/find-my-member-paginated.http.controller'
import { FindMyMemberPaginatedQueryHandler } from './queries/find-my-member-paginated/find-my-member-paginated.query-handler'
import { UpdateOrganizationHttpController } from './commands/update-organization/update-organization.controller.http'
import { UpdateOrganizationService } from './commands/update-organization/update-organization.service'
import { FilesystemDomainService } from '../filesystem/domain/domain-service/filesystem.domain-service'
import { FilesystemApiService } from '../filesystem/infra/filesystem.api.service'

const httpControllers = [
  FindOrganizationHttpController,
  FindOrganizationPaginatedHttpController,
  FindMemberPaginatedHttpController,
  FindMyMemberPaginatedHttpController,
  CreateOrganizationHttpController,
  UpdateOrganizationHttpController,
]

const queryHandlers: Provider[] = [
  FindOrganizationQueryHandler,
  FindOrganizationPaginatedQueryHandler,
  FindMemberPaginatedQueryHandler,
  FindMyMemberPaginatedQueryHandler,
]

const repositories: Provider[] = [
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]

const providers: Provider[] = [
  PrismaService,
  OrganizationService,
  CreateOrganizationService,
  UpdateOrganizationService,
  FilesystemDomainService,
  FilesystemApiService,
]

const mappers: Provider[] = [UserMapper, UserRoleMapper, OrganizationMapper]

@Module({
  imports: [CqrsModule],
  providers: [...providers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [OrganizationService],
})
export class OrganizationModule {}
