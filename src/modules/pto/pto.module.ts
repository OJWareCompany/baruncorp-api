import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreatePtoHttpController } from './commands/create-pto/create-pto.http.controller'
import { UpdatePtoTotalHttpController } from './commands/update-pto-total/update-pto-total.http.controller'
import { FindPtoPaginatedHttpController } from './queries/find-pto-paginated/find-pto.paginated.http.controller'
import { CreatePtoService } from './commands/create-pto/create-pto.service'
import { UpdatePtoTotalService } from './commands/update-pto-total/update-pto-total.service'
import { FindPtoPaginatedQueryHandler } from './queries/find-pto-paginated/find-pto.paginated.query-handler'
import { PTO_REPOSITORY } from './pto.di-token'
import { PtoRepository } from './database/pto.repository'
import { PtoMapper } from './pto.mapper'
import { PtoTenurePolicyModule } from '../pto-tenure-policy/pto-tenure-policy.module'
import { UsersModule } from '../users/users.module'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRepository } from '../users/database/user.repository'
import { UserRoleMapper } from '../users/user-role.mapper'
import { CreatePtoDetailHttpController } from './commands/create-pto-detail/create-pto-detail.http.controller'
import { CreatePtoDetailService } from './commands/create-pto-detail/create-pto-detail.service'
import { UpdatePtoDetailService } from './commands/update-pto-detail/update-pto-detail.service'
import { DeletePtoDetailService } from './commands/delete-pto-detail/delete-pto-datail.service'
import { UpdatePtoDetailHttpController } from './commands/update-pto-detail/update-pto-detail.http.controller'
import { DeletePtoDetailHttpController } from './commands/delete-pto-detail/delete-pto-datail.http.controller'
import { UpdatePtoPayHttpController } from './commands/update-pto-pay/update-pto-pay.http.controller'
import { UpdatePtoPayService } from './commands/update-pto-pay/update-pto-pay.service'
import { FindPtoDetailPaginatedHttpController } from './queries/find-pto-detail-paginated/find-pto-detail.paginated.http.controller'
import { FindPtoDetailPaginatedQueryHandler } from './queries/find-pto-detail-paginated/find-pto-detail.paginated.query-handler'

const httpControllers = [
  CreatePtoHttpController,
  UpdatePtoTotalHttpController,
  UpdatePtoPayHttpController,
  CreatePtoDetailHttpController,
  UpdatePtoDetailHttpController,
  DeletePtoDetailHttpController,
  FindPtoPaginatedHttpController,
  FindPtoDetailPaginatedHttpController,
]
const commandHandlers: Provider[] = [
  CreatePtoService,
  UpdatePtoTotalService,
  UpdatePtoPayService,
  CreatePtoDetailService,
  UpdatePtoDetailService,
  DeletePtoDetailService,
]
const queryHandlers: Provider[] = [FindPtoPaginatedQueryHandler, FindPtoDetailPaginatedQueryHandler]
const repositories: Provider[] = [
  PtoRepository,
  { provide: PTO_REPOSITORY, useClass: PtoRepository },
  { provide: USER_REPOSITORY, useClass: UserRepository },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [PtoMapper, UserMapper, UserRoleMapper]

@Module({
  imports: [CqrsModule, PrismaModule, PtoTenurePolicyModule, UsersModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class PtoModule {}
