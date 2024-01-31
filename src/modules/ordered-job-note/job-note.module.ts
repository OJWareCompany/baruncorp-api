import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateJobNoteHttpController } from './commands/create-job-note/create-job-note.http.controller'
import { CreateJobNoteService } from './commands/create-job-note/create-job-note.service'
import { JobNoteMapper } from './job-note.mapper'
import { FindJobNotesHttpController } from './queries/find-job-notes/find-job-notes.pagenated.http.controller'
import { FindJobNotesQueryHandler } from './queries/find-job-notes/find-job-notes.pagenated.query-handler'
import { UsersModule } from '../users/users.module'
import { JOB_NOTE_REPOSITORY } from './job-note.di-token'
import { JobNoteRepository } from './database/job-note.repository'

const httpControllers = [CreateJobNoteHttpController, FindJobNotesHttpController]
const commandHandlers: Provider[] = [CreateJobNoteService]
const queryHandlers: Provider[] = [FindJobNotesQueryHandler]

const repositories: Provider[] = [{ provide: JOB_NOTE_REPOSITORY, useClass: JobNoteRepository }, JobNoteRepository]

const mappers: Provider[] = [JobNoteMapper]

@Module({
  imports: [CqrsModule, PrismaModule, CqrsModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class OrderedJobNoteModule {}
