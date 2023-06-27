import { Module, Provider } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationController } from './organization.controller'
import { ORGANIZATION_REPOSITORY } from './organization.di-token'
import { OrganizationRepository } from './database/organization.repository'
import { PrismaService } from '../database/prisma.service'

const repositories: Provider[] = [
  {
    provide: ORGANIZATION_REPOSITORY,
    useClass: OrganizationRepository,
  },
]

const providers: Provider[] = [OrganizationService, PrismaService]

@Module({
  providers: [...providers, ...repositories],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
