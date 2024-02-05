import { Module, Provider, forwardRef } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { UsersModule } from '../users/users.module'
import { GeographyRepository } from './database/geography.repository'
import { AhjNoteHistoryMapper } from './ahj-note-history.mapper'
import { AhjNoteMapper } from './ahj-note.mapper'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { GeographyController } from './geography.controller'
import { GeographyService } from './geography.service'
import { AhjNoteGeneratorDomainService } from './domain/domain-services/ahj-generator.domain-service'
import { FilesystemApiService } from '../filesystem/infra/filesystem.api.service'
import { FilesystemDomainService } from '../filesystem/domain/domain-service/filesystem.domain-service'
import { GoogleAhjNoteFolderDomainService } from '../filesystem/domain/domain-service/google-ahj-note-folder.domain-service'

const repositories: Provider[] = [{ provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository }]
const mappers: Provider[] = [AhjNoteMapper, AhjNoteHistoryMapper]
const services: Provider[] = [
  GeographyService,
  FilesystemApiService,
  FilesystemDomainService,
  GoogleAhjNoteFolderDomainService,
]
const domainServices: Provider[] = [AhjNoteGeneratorDomainService]

@Module({
  imports: [PrismaModule, forwardRef(() => UsersModule)],
  providers: [...services, ...repositories, ...mappers, ...domainServices],
  controllers: [GeographyController],
  exports: [AhjNoteGeneratorDomainService, ...repositories, ...mappers],
})
export class GeographyModule {}
