import { Module, Provider } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { GeographyController } from './geography.controller'
import { GEOGRAPHY_REPOSITORY } from './geography.di-token'
import { GeographyRepository } from './database/geography.repository'
import { PrismaModule } from '../database/prisma.module'

const repositories: Provider[] = [{ provide: GEOGRAPHY_REPOSITORY, useClass: GeographyRepository }]
const services: Provider[] = [GeographyService]

@Module({
  imports: [PrismaModule],
  providers: [...services, ...repositories],
  controllers: [GeographyController],
})
export class GeographyModule {}
