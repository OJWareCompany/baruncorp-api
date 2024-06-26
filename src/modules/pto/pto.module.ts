import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
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
import { FindPtoAnnualPaginatedHttpController } from './queries/find-pto-annual-paginated/find-pto-annual.paginated.http.controller'
import { FindPtoAnnualPaginatedQueryHandler } from './queries/find-pto-annual-paginated/find-pto-annual.paginated.query-handler'
import { CreatePtoWhenUserCreatedEventHandler } from './application/event-handlers/create-pto-when-user-created.domain-event-handler'
import { FindPtoTypePaginatedHttpController } from './queries/find-pto-type-paginated/find-pto-type.paginated.http.controller'
import { FindPtoTypePaginatedQueryHandler } from './queries/find-pto-type-paginated/find-pto-type.paginated.query-handler'
import { UpdatePtoRangeWhenUserUpdatedEventHandler } from './application/event-handlers/update-pto-range-when-user-updated.domain-event-handler'
import { UpdatePtoRangeService } from './commands/update-pto-range/update-pto-range.service'
import { UpdatePtoWhenUserJoinClientDomainEventHandler } from './application/event-handlers/update-pto-when-user-join-client-organization.domain-event-handler'
import { OrganizationModule } from '../organization/organization.module'

const httpControllers = [
  CreatePtoHttpController,
  UpdatePtoTotalHttpController,
  UpdatePtoPayHttpController,
  CreatePtoDetailHttpController,
  UpdatePtoDetailHttpController,
  DeletePtoDetailHttpController,
  FindPtoPaginatedHttpController,
  FindPtoDetailPaginatedHttpController,
  FindPtoAnnualPaginatedHttpController,
  FindPtoTypePaginatedHttpController,
]
const commandHandlers: Provider[] = [
  CreatePtoService,
  UpdatePtoTotalService,
  UpdatePtoPayService,
  UpdatePtoRangeService,
  CreatePtoDetailService,
  UpdatePtoDetailService,
  DeletePtoDetailService,
]
const queryHandlers: Provider[] = [
  FindPtoPaginatedQueryHandler,
  FindPtoDetailPaginatedQueryHandler,
  FindPtoAnnualPaginatedQueryHandler,
  FindPtoTypePaginatedQueryHandler,
]
const eventHandlers: Provider[] = [
  CreatePtoWhenUserCreatedEventHandler,
  UpdatePtoRangeWhenUserUpdatedEventHandler,
  UpdatePtoWhenUserJoinClientDomainEventHandler,
]
const repositories: Provider[] = [{ provide: PTO_REPOSITORY, useClass: PtoRepository }]
const mappers: Provider[] = [PtoMapper]

@Module({
  imports: [CqrsModule, PrismaModule, OrganizationModule, PtoTenurePolicyModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class PtoModule {}
