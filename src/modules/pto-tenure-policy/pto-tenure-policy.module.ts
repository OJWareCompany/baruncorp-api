import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { FindPtoTenurePolicyPaginatedQueryHandler } from './queries/find-pto-tenure-policy-paginated/find-pto-tenure-policy.paginated.query-handler'
import { FindPtoTenurePolicyPaginatedHttpController } from './queries/find-pto-tenure-policy-paginated/find-pto-tenure-policy.paginated.http.controller'
import { UpdatePtoTenurePolicyHttpController } from './commands/update-pto-tenure-policy/update-pto-tenure-policy.http.controller'
import { UpdatePtoTenurePolicyService } from './commands/update-pto-tenure-policy/update-pto-tenure-policy.service'
import { PtoTenurePolicyRepository } from './database/pto-tenure-policy.repository'
import { PtoTenurePolicyMapper } from './pto-tenure-policy.mapper'
import { PTO_TENURE_REPOSITORY } from './pto-tenure-policy.di-token'
import { UsersModule } from '../users/users.module'

const httpControllers = [UpdatePtoTenurePolicyHttpController, FindPtoTenurePolicyPaginatedHttpController]
const commandHandlers: Provider[] = [UpdatePtoTenurePolicyService]
const queryHandlers: Provider[] = [FindPtoTenurePolicyPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: PTO_TENURE_REPOSITORY,
    useClass: PtoTenurePolicyRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [PtoTenurePolicyMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class PtoTenurePolicyModule {}
