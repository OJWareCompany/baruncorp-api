import { Controller, Get, Query } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyProp } from './interfaces/company.interface'
import { CompanyMember } from './database/company.repository.port'

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('')
  async findAll(): Promise<CompanyProp[]> {
    return await this.companyService.findAll()
  }

  @Get('members')
  async findMembers(@Query('companyId') companyId: number): Promise<CompanyMember | CompanyMember[]> {
    if (companyId) {
      return await this.companyService.findMembersByCompanyId(companyId)
    } else {
      return await this.companyService.findMembers()
    }
  }
}
