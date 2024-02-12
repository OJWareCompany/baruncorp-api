import { Module, Provider, forwardRef } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '../database/prisma.module'
import { PutScheduleHttpController } from './commands/update-information/put-schedule.http.controller'
import { ScheduleRepository } from './database/schedule.repository'
import { ScheduleMapper } from './schedule.mapper'
import { SCHEDULE_REPOSITORY } from './schedule.di-token'
import { UsersModule } from '../users/users.module'
import { PutScheduleService } from '@modules/schedule/commands/update-information/put-schedule.service'
import { USER_REPOSITORY } from '@modules/users/user.di-tokens'
import { UserRepository } from '@modules/users/database/user.repository'

const httpControllers = [PutScheduleHttpController]
const commandHandlers: Provider[] = [PutScheduleService]
const queryHandlers: Provider[] = []
const repositories: Provider[] = [
  {
    provide: SCHEDULE_REPOSITORY,
    useClass: ScheduleRepository,
  },
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
]
const eventHandlers: Provider[] = []
const mappers: Provider[] = [ScheduleMapper]

@Module({
  imports: [CqrsModule, PrismaModule, forwardRef(() => UsersModule)],
  providers: [...commandHandlers, ...eventHandlers, ...queryHandlers, ...repositories, ...mappers],
  controllers: [...httpControllers],
  exports: [...repositories, ...mappers],
})
export class ScheduleModule {}
