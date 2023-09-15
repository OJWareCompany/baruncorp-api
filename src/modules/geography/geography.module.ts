import { Module, Provider } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { GeographyController } from './geography.controller'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { GeographyRepository } from './database/geography.repository'
import { PrismaModule } from '../database/prisma.module'
import { AhjNoteMapper } from './ahj-note.mapper'
import { UsersModule } from '../users/users.module'
import { UserRepository } from '../users/database/user.repository'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import UserMapper from '../users/user.mapper'
import { UserRoleMapper } from '../users/user-role.mapper'
import { LicenseMapper } from '../department/license.mapper'
import { AhjNoteHistoryMapper } from './ahj-note-history.mapper'

const repositories: Provider[] = [
  { provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository },

  { provide: USER_REPOSITORY, useClass: UserRepository },
]
const mappers: Provider[] = [AhjNoteMapper, AhjNoteHistoryMapper, UserMapper, UserRoleMapper, LicenseMapper]
const services: Provider[] = [GeographyService]

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [...services, ...repositories, ...mappers],
  controllers: [GeographyController],
})
export class GeographyModule {}
