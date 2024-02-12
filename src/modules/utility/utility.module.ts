import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { UtilityRepository } from './database/utility.repository'
import { UsersModule } from '../users/users.module'
import { UTILITY_REPOSITORY } from '@modules/utility/utility.di-token'
import { CreateUtilityHttpController } from '@modules/utility/commands/create-utility/create-utility.http.controller'
import { CreateUtilityService } from '@modules/utility/commands/create-utility/create-utility.service'
import { UtilityMapper } from '@modules/utility/utility.mapper'
import { UpdateUtilityHttpController } from '@modules/utility/commands/update-utility/update-utility.http.controller'
import { UpdateUtilityService } from '@modules/utility/commands/update-utility/update-utility.service'
import { FindUtilityHttpController } from '@modules/utility/queries/find-utility/find-utility.http.controller'
import { FindUtilityQueryHandler } from '@modules/utility/queries/find-utility/find-utility.query-handler'
import {
  FindUtilityPaginatedQuery,
  FindUtilityPaginatedQueryHandler,
} from '@modules/utility/queries/find-utility-paginated/utility.paginated.query-handler'
import { FindUtilityPaginatedHttpController } from '@modules/utility/queries/find-utility-paginated/utility.paginated.http.controller'

const httpControllers = [
  CreateUtilityHttpController,
  UpdateUtilityHttpController,
  FindUtilityHttpController,
  FindUtilityPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateUtilityService, UpdateUtilityService]
const queryHandlers: Provider[] = [FindUtilityQueryHandler, FindUtilityPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: UTILITY_REPOSITORY,
    useClass: UtilityRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [UtilityMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class UtilityModule {}
