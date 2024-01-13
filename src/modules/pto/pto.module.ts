import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreatePtoHttpController } from './commands/create-pto/create-pto.http.controller'
import { UpdatePtoHttpController } from './commands/update-pto/update-pto.http.controller'
import { DeletePtoHttpController } from './commands/delete-pto/delete-pto.http.controller'
import { FindPtoHttpController } from './queries/find-pto/find-pto.http.controller'
import { FindPtoPaginatedHttpController } from './queries/find-pto-paginated/find-pto.paginated.http.controller'
import { CreatePtoService } from './commands/create-pto/create-pto.service'
import { UpdatePtoService } from './commands/update-pto/update-pto.service'
import { DeletePtoService } from './commands/delete-pto/delete-pto.service'
import { FindPtoQueryHandler } from './queries/find-pto/find-pto.query-handler'
import { FindPtoPaginatedQueryHandler } from './queries/find-pto-paginated/find-pto.paginated.query-handler'
import { PTO_REPOSITORY } from './pto.di-token'
import { PtoRepository } from './database/pto.repository'
import { PtoMapper } from './pto.mapper'
import { PtoTenurePolicyRepository } from '../pto-tenure-policy/database/pto-tenure-policy.repository'
import { PtoTenurePolicyModule } from '../pto-tenure-policy/pto-tenure-policy.module'
import { UsersModule } from '../users/users.module'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { UserRoleMapper } from '../users/user-role.mapper'

const httpControllers = [
  CreatePtoHttpController,
  UpdatePtoHttpController,
  DeletePtoHttpController,
  FindPtoHttpController,
  FindPtoPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreatePtoService, UpdatePtoService, DeletePtoService]
const queryHandlers: Provider[] = [FindPtoQueryHandler, FindPtoPaginatedQueryHandler]
const repositories: Provider[] = [PtoRepository, { provide: USER_REPOSITORY, useClass: UserRepository }]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [PtoMapper, UserMapper, UserRoleMapper]

@Module({
  imports: [CqrsModule, PrismaModule, PtoTenurePolicyModule, UsersModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class PtoModule {}
