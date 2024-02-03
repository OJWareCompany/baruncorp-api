import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { FilesystemApiService } from './infra/filesystem.api.service'
import { CreateGoogleJobNoteFolderHttpController } from './commands/create-google-job-note-folder/create-google-job-note-folder.http.controller'
import { CreateGoogleJobNoteFolderService } from './commands/create-google-job-note-folder/create-google-job-note-folder.service'
import { GoogleJobNoteFolderMapper } from './google-job-note-folder.mapper'
import { GOOGLE_JOB_NOTE_FOLDER_REPOSITORY } from './filesystem.di-token'
import { GoogleJobNoteFolderRepository } from './database/google-job-note-folder.repository'
import { FindNonCountedJobFoldersHttpController } from './queries/find-non-counted-job-folders/find-non-counted-job-folders.http.controller'
import { FindNonCountedJobFoldersQueryHandler } from './queries/find-non-counted-job-folders/find-non-counted-job-folders.query-handler'
import { UpdateGoogleSharedDriveCountService } from './commands/update-google-shared-drive-count/update-google-shared-drive-count.service'
import { UpdateGoogleSharedDriveCountHttpController } from './commands/update-google-shared-drive-count/update-google-shared-drive-count.http.controller'
import { FilesystemDomainService } from './domain/domain-service/filesystem.domain-service'

const httpControllers = [
  CreateGoogleJobNoteFolderHttpController,
  FindNonCountedJobFoldersHttpController,
  UpdateGoogleSharedDriveCountHttpController,
]

const commandHandlers: Provider[] = [CreateGoogleJobNoteFolderService, UpdateGoogleSharedDriveCountService]

const queryHandlers: Provider[] = [FindNonCountedJobFoldersQueryHandler]

const repositories: Provider[] = [
  {
    provide: GOOGLE_JOB_NOTE_FOLDER_REPOSITORY,
    useClass: GoogleJobNoteFolderRepository,
  },
]

const mappers: Provider[] = [GoogleJobNoteFolderMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [
    FilesystemApiService,
    FilesystemDomainService,
    ...commandHandlers,
    ...mappers,
    ...repositories,
    ...queryHandlers,
  ],
  controllers: [...httpControllers],
  exports: [FilesystemApiService, FilesystemDomainService],
})
export class FilesystemModule {}
