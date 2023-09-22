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

const httpControllers = [CreateServiceHttpController, UpdateServiceHttpController]
const commandHandlers: Provider[] = [CreateServiceService, UpdateServiceService]
const mappers: Provider[] = [ServiceMapper]
const repositories: Provider[] = [{ provide: SERVICE_REPOSITORY, useClass: ServiceRepository }]
@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...mappers, ...repositories, ...commandHandlers],
  controllers: [...httpControllers],
})
export class ServiceModule {}
