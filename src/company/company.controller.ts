import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyProp } from './interfaces/company.interface'
import { CompanyMember } from './database/company.repository.port'
import { CreateCompnayReq } from './dto/req/create-company.req'

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

  @Post('')
  async createCompany(@Body() dto: CreateCompnayReq) {
    return await this.companyService.createCompany(dto)
  }
}
