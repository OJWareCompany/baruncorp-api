import { Module, Provider } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { UserRepository } from '../users/database/user.repository'
import { USER_REPOSITORY } from '../users/user.di-tokens'
import { UserRoleMapper } from '../users/user-role.mapper'
import { UsersModule } from '../users/users.module'
import UserMapper from '../users/user.mapper'
import { GeographyRepository } from './database/geography.repository'
import { AhjNoteHistoryMapper } from './ahj-note-history.mapper'
import { AhjNoteMapper } from './ahj-note.mapper'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { GeographyController } from './geography.controller'
import { GeographyService } from './geography.service'
import { AhjNoteGeneratorDomainService } from './domain/domain-services/ahj-generator.domain-service'

const repositories: Provider[] = [
  { provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository },

  { provide: USER_REPOSITORY, useClass: UserRepository },
]
const mappers: Provider[] = [AhjNoteMapper, AhjNoteHistoryMapper, UserMapper, UserRoleMapper]
const services: Provider[] = [GeographyService]
const domainServices: Provider[] = [AhjNoteGeneratorDomainService]

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [...services, ...repositories, ...mappers, ...domainServices],
  controllers: [GeographyController],
  exports: [AhjNoteGeneratorDomainService],
})
export class GeographyModule {}
