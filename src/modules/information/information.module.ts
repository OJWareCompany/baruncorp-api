import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { UpdateInformationHttpController } from './commands/update-information/update-information.http.controller'
import { UpdateInformationService } from './commands/update-information/update-information.service'
import { InformationRepository } from './database/information.repository'
import { InformationMapper } from './information.mapper'
import { INFORMATION_REPOSITORY } from './information.di-token'
import { UsersModule } from '../users/users.module'
import { FindInformationPaginatedHttpController } from './queries/find-information-paginated/information.paginated.http.controller'
import { InformationPaginatedQueryHandler } from './queries/find-information-paginated/information.paginated.query-handler'
import { CreateInformationHttpController } from './commands/create-information/create-information.http.controller'
import { CreateInformationService } from './commands/create-information/create-information.service'

const httpControllers = [
  CreateInformationHttpController,
  UpdateInformationHttpController,
  FindInformationPaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateInformationService, UpdateInformationService]
const queryHandlers: Provider[] = [InformationPaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: INFORMATION_REPOSITORY,
    useClass: InformationRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [InformationMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class InformationModule {}
