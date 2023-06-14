import { Module, Provider } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { COMPANY_REPOSITORY } from './company.di-token'
import { CompanyRepository } from './database/company.repository'
import { PrismaService } from '../database/prisma.service'

const repositories: Provider[] = [
  {
    provide: COMPANY_REPOSITORY,
    useClass: CompanyRepository,
  },
]

const providers: Provider[] = [CompanyService, PrismaService]

@Module({
  providers: [...providers, ...repositories],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
