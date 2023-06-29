import { IsEmail, IsString, Matches } from 'class-validator'
import { OrganizationProp } from '../../interfaces/organization.interface'

export class CreateOrganizationReq implements Omit<OrganizationProp, 'id'> {
  @IsEmail()
  email: string

  @IsString()
  street1: string

  @IsString()
  street2: string

  @IsString()
  city: string

  @IsString()
  stateOrRegion: string

  @IsString()
  postalCode: string

  @IsString()
  country: string

  @IsString()
  phoneNumber: string

  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  @Matches(/(client|individual|outsourcing)/, { message: 'Organization Type Not Found' })
  organizationType: string
}
