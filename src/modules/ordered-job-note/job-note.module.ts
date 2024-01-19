import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateJobNoteHttpController } from './commands/create-job-note/create-job-note.http.controller'
import { CreateJobNoteService } from './commands/create-job-note/create-job-note.service'
import { JobNoteMapper } from './job-note.mapper'
import { FindJobNotesHttpController } from './queries/find-job-notes/find-job-notes.http.controller'
import { FindJobNotesQueryHandler } from './queries/find-job-notes/find-job-notes.query-handler'
import { UsersModule } from '../users/users.module'

const httpControllers = [CreateJobNoteHttpController, FindJobNotesHttpController]
const commandHandlers: Provider[] = [CreateJobNoteService]
const queryHandlers: Provider[] = [FindJobNotesQueryHandler]
const mappers: Provider[] = [JobNoteMapper]

@Module({
  imports: [PrismaModule, CqrsModule, UsersModule],
  providers: [...commandHandlers, ...queryHandlers, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class OrderedJobNoteModule {}
