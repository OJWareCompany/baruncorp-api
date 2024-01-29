import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { FilesystemApiService } from './infra/filesystem.api.service'
import { CreateGoogleJobNoteFolderHttpController } from './commands/create-google-job-note-folder/create-google-job-note-folder.http.controller'
import { CreateGoogleJobNoteFolderService } from './commands/create-google-job-note-folder/create-google-job-note-folder.service'
import { GoogleJobNoteFolderMapper } from './google-job-note-folder.mapper'
import { GOOGLE_JOB_NOTE_FOLDER_REPOSITORY } from './filesystem.di-token'
import { GoogleJobNoteFolderRepository } from './database/google-job-note-folder.repository'

const httpControllers = [CreateGoogleJobNoteFolderHttpController]

const commandHandlers: Provider[] = [CreateGoogleJobNoteFolderService]

const repositories: Provider[] = [
  {
    provide: GOOGLE_JOB_NOTE_FOLDER_REPOSITORY,
    useClass: GoogleJobNoteFolderRepository,
  },
]

const mappers: Provider[] = [GoogleJobNoteFolderMapper]

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [FilesystemApiService, ...commandHandlers, ...mappers, ...repositories],
  exports: [FilesystemApiService],
  controllers: [...httpControllers],
})
export class FilesystemModule {}
