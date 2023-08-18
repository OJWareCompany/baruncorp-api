import { Module, Provider } from '@nestjs/common'
import { SearchCensusHttpController } from './commands/create-ahj-note/search-census.http.controller'
import { PrismaModule } from '../database/prisma.module'
import { GEOGRAPHY_REPOSITORY } from '../geography/geography.di-token'
import { GeographyRepository } from '../geography/database/geography.repository'
import { SearchCensusService } from './commands/create-ahj-note/search-census.service'

const repositories: Provider[] = [{ provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository }]

@Module({
  imports: [PrismaModule],
  providers: [SearchCensusService, ...repositories],
  controllers: [SearchCensusHttpController],
})
export class ProjectModule {}
