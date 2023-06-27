import { IsString, Matches } from 'class-validator'
import { OrganizationProp } from '../../interfaces/organization.interface'

export class CreateOrganizationReq implements Omit<OrganizationProp, 'id'> {
  @IsString()
  name: string

  @IsString()
  description: string

  // TODO: use constant variable
  @IsString()
  @Matches(/(barunCorp|client|individual|outsourcing)/, { message: 'Organization Type Not Found' })
  organizationType: string
}
