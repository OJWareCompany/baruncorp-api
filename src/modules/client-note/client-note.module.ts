import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { UpdateClientNoteHttpController } from './commands/update-client-note/update-client-note.http.controller'
import { UpdateClientNoteService } from './commands/update-client-note/update-client-note.service'
import { ClientNoteRepository } from './database/client-note.repository'
import { ClientNoteMapper } from './client-note.mapper'
import { CLIENT_NOTE_REPOSITORY } from './client-note.di-token'
import { UsersModule } from '../users/users.module'
import { FindClientNotePaginatedQueryHandler } from './queries/find-client-note-paginated/client-note.paginated.query-handler'
import { FindClientNotePaginatedHttpController } from './queries/find-client-note-paginated/client-note.paginated.http.controller'
import { CreateClientNoteHttpController } from './commands/create-client-note/create-client-note.http.controller'
import { CreateClientNoteService } from './commands/create-client-note/create-client-note.service'
import { FindClientNoteHttpController } from './queries/find-client-note/find-client-note.http.controller'
import { FindClientNoteQueryHandler } from './queries/find-client-note/find-client-note.query-handler'

const httpControllers = [
  CreateClientNoteHttpController,
  UpdateClientNoteHttpController,
  FindClientNoteHttpController,
  FindClientNotePaginatedHttpController,
]
const commandHandlers: Provider[] = [CreateClientNoteService, UpdateClientNoteService]
const queryHandlers: Provider[] = [FindClientNoteQueryHandler, FindClientNotePaginatedQueryHandler]
const repositories: Provider[] = [
  {
    provide: CLIENT_NOTE_REPOSITORY,
    useClass: ClientNoteRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [ClientNoteMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class ClientNoteModule {}
