import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateJobNoteHttpController } from './commands/create-job-note/create-job-note.http.controller'
import { CreateJobNoteService } from './commands/create-job-note/create-job-note.service'
import UserMapper from '../users/user.mapper'
import { JobNoteMapper } from './job-note.mapper'
import { FindJobNotesHttpController } from './queries/find-job-notes/find-job-notes.http.controller'
import { FindJobNotesQueryHandler } from './queries/find-job-notes/find-job-notes.query-handler'

const httpControllers = [CreateJobNoteHttpController, FindJobNotesHttpController]
const commandHandlers: Provider[] = [CreateJobNoteService]
const queryHandlers: Provider[] = [FindJobNotesQueryHandler]
const mappers: Provider[] = [UserMapper, JobNoteMapper]

@Module({
  imports: [PrismaModule, CqrsModule],
  providers: [...commandHandlers, ...queryHandlers, ...mappers],
  controllers: [...httpControllers],
  exports: [],
})
export class OrderedJobNoteModule {}
