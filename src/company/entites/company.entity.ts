import { CompanyProp } from '../interfaces/company.interface'

export class CompanyEntity implements CompanyProp {
  id: number
  name: string
  description: string
  // TODO: gonna be VO
  companyType: string
}
