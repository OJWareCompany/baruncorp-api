import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CreateServiceService } from './commands/create-service/create-service.service'
import { CreateServiceHttpController } from './commands/create-service/create-service.http.controller'
import { SERVICE_REPOSITORY } from './service.di-token'
import { ServiceRepository } from './database/service.repository'
import { PrismaModule } from '../database/prisma.module'
import { ServiceMapper } from './service.mapper'
import { UpdateServiceService } from './commands/update-service/update-service.service'
import { UpdateServiceHttpController } from './commands/update-service/update-service.http.controller'
import { DeleteServiceHttpController } from './commands/delete-service/delete-service.http.controller'
import { DeleteServiceService } from './commands/delete-service/delete-service.service'
import { FindServiceHttpController } from './queries/find-service/find-service.http.controller'
import { FindServicePaginatedHttpController } from './queries/find-service-paginated/find-service-paginated.http.controller'
import { FindServiceQueryHandler } from './queries/find-service/find-service.query-handler'
import { FindServicePaginatedQueryHandler } from './queries/find-service-paginated/find-service-paginated.query-handler'

const httpControllers = [
  CreateServiceHttpController,
  UpdateServiceHttpController,
  DeleteServiceHttpController,
  FindServiceHttpController,
  FindServicePaginatedHttpController,
]
const commandHandlers: Provider[] = [
  CreateServiceService,
  UpdateServiceService,
  DeleteServiceService,
  FindServiceQueryHandler,
  FindServicePaginatedQueryHandler,
]
const mappers: Provider[] = [ServiceMapper]
const repositories: Provider[] = [{ provide: SERVICE_REPOSITORY, useClass: ServiceRepository }]
@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
  controllers: [...httpControllers],
})
export class ServiceModule {}
