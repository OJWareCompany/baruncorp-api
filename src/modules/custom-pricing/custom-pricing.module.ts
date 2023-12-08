import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import UserMapper from '../users/user.mapper'
import { CreateCustomPricingHttpController } from './commands/create-custom-pricing/create-custom-pricing.http.controller'
import { UpdateCustomPricingHttpController } from './commands/update-custom-pricing/update-custom-pricing.http.controller'
import { DeleteCustomPricingHttpController } from './commands/delete-custom-pricing/delete-custom-pricing.http.controller'
import { FindCustomPricingHttpController } from './queries/find-custom-pricing/find-custom-pricing.http.controller'
import { FindCustomPricingPaginatedHttpController } from './queries/find-custom-pricing-paginated/find-custom-pricing.paginated.http.controller'
import { CreateCustomPricingService } from './commands/create-custom-pricing/create-custom-pricing.service'
import { UpdateCustomPricingService } from './commands/update-custom-pricing/update-custom-pricing.service'
import { DeleteCustomPricingService } from './commands/delete-custom-pricing/delete-custom-pricing.service'
import { FindCustomPricingPaginatedQueryHandler } from './queries/find-custom-pricing-paginated/find-custom-pricing.paginated.query-handler'
import { CUSTOM_PRICING_REPOSITORY } from './custom-pricing.di-token'
import { CustomPricingRepository } from './database/custom-pricing.repository'
import { CustomPricingMapper } from './custom-pricing.mapper'
import { FindCreatableCustomPricingHttpController } from './queries/find-creatable-custom-pricing/find-creatable-custom-pricing.http.controller'

const httpControllers = [
  CreateCustomPricingHttpController,
  UpdateCustomPricingHttpController,
  DeleteCustomPricingHttpController,
  FindCustomPricingHttpController,
  FindCustomPricingPaginatedHttpController,
  FindCreatableCustomPricingHttpController,
]
const commandHandlers: Provider[] = [CreateCustomPricingService, UpdateCustomPricingService, DeleteCustomPricingService]
const queryHandlers: Provider[] = [FindCustomPricingPaginatedQueryHandler, FindCustomPricingPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: CUSTOM_PRICING_REPOSITORY,
    useClass: CustomPricingRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [CustomPricingMapper, UserMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
})
export class CustomPricingModule {}
