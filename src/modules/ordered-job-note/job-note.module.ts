import { Module, Provider, forwardRef, OnModuleInit } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { CreateJobNoteHttpController } from './commands/create-job-note/create-job-note.http.controller'
import { CreateJobNoteService } from './commands/create-job-note/create-job-note.service'
import { JobNoteMapper } from './job-note.mapper'
import { FindJobNotesHttpController } from './queries/find-job-notes/find-job-notes.http.controller'
import { FindJobNotesQueryHandler } from './queries/find-job-notes/find-job-notes.query-handler'
import { UsersModule } from '../users/users.module'
import { JOB_NOTE_REPOSITORY } from './job-note.di-token'
import { JobNoteRepository } from './database/job-note.repository'
import { RFIMailer } from './infrastructure/mailer.infrastructure'
import { ImapManagerService } from '@modules/ordered-job-note/infrastructure/imap.manager.service'

import { ImapConnectionWhenUserStatusChangedEventHandler } from '@modules/ordered-job-note/application/event-handler/imap-connection-when-user-status-updated.domain-event-handler'
import { FilesystemApiService } from '../filesystem/infra/filesystem.api.service'
import { ConfigModule } from '@nestjs/config'

ConfigModule.forRoot()

const httpControllers = [CreateJobNoteHttpController, FindJobNotesHttpController]
const commandHandlers: Provider[] = [CreateJobNoteService]
const queryHandlers: Provider[] = [FindJobNotesQueryHandler]
const eventHandlers: Provider[] = [ImapConnectionWhenUserStatusChangedEventHandler]

const repositories: Provider[] = [{ provide: JOB_NOTE_REPOSITORY, useClass: JobNoteRepository }, JobNoteRepository]

const mappers: Provider[] = [JobNoteMapper]

const infrastructures: Provider[] = [RFIMailer, ImapManagerService]

@Module({
  imports: [CqrsModule, PrismaModule, CqrsModule, forwardRef(() => UsersModule)],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...repositories,
    ...mappers,
    ...infrastructures,
    FilesystemApiService,
  ],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers, ...infrastructures],
})
export class OrderedJobNoteModule implements OnModuleInit {
  constructor(private readonly imapManagerService: ImapManagerService) {}
  onModuleInit() {
    const imapOnOff = process.env.IMAP_ON_OFF
    if (imapOnOff === 'true') {
      this.imapManagerService.initImapConnection()
      console.log('true imap')
    } else {
      console.log('no imap')
    }
  }
}
