import { IsString, Matches } from 'class-validator'
import { CompanyProp } from '../../../company/interfaces/company.interface'

export class CreateCompnayReq implements Omit<CompanyProp, 'id'> {
  @IsString()
  name: string

  @IsString()
  description: string

  // TODO: use constant variable
  @IsString()
  @Matches(/(barunCorp|client|individual|outsourcing)/, { message: 'Company Type Not Found' })
  companyType: string
}
