import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateGoogleSharedDriveWhenOrganizationIsCreatedDomainEventHandler } from './application/event-handlers/create-google-shared-drive-when-organization-is-created.domain-event-handler'
import { FilesystemApiService } from './infra/filesystem.api.service'

const eventHandlers: Provider[] = [CreateGoogleSharedDriveWhenOrganizationIsCreatedDomainEventHandler]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [FilesystemApiService, ...eventHandlers],
  exports: [],
  // controllers: [...httpControllers],
})
export class FilesystemModule {}
