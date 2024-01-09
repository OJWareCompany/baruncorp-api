import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { FindPtoTenurePolicyPaginatedQueryHandler } from './queries/find-pto-tenure-policy-paginated/find-pto-tenure-policy.paginated.query-handler'
import { FindPtoTenurePolicyPaginatedHttpController } from './queries/find-pto-tenure-policy-paginated/find-pto-tenure-policy.paginated.http.controller'
import { UpdatePtoTenurePolicyHttpController } from './commands/update-pto-tenure-policy/update-pto-tenure-policy.http.controller'
import { UpdatePtoTenurePolicyService } from './commands/update-pto-tenure-policy/update-pto-tenure-policy.service'
import { PtoTenurePolicyRepository } from './database/pto-tenure-policy.repository'
import { PtoTenurePolicyMapper } from './pto-tenure-policy.mapper'

const httpControllers = [UpdatePtoTenurePolicyHttpController, FindPtoTenurePolicyPaginatedHttpController]
const commandHandlers: Provider[] = [UpdatePtoTenurePolicyService]
const queryHandlers: Provider[] = [FindPtoTenurePolicyPaginatedQueryHandler]
const repositories: Provider[] = [PtoTenurePolicyRepository]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [PtoTenurePolicyMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class PtoTenurePolicyModule {}
