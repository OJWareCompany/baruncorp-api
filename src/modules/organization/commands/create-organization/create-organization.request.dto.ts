import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsObject, IsOptional, IsString, Matches } from 'class-validator'
import { AddressDto } from '../../../ordered-job/dtos/address.dto'

export class CreateOrganizationRequestDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  @IsOptional()
  readonly email: string | null

  @ApiProperty({ default: AddressDto })
  @IsObject()
  readonly address: AddressDto

  @ApiProperty({ default: '01012341234' })
  @IsString()
  @IsOptional()
  readonly phoneNumber: string | null

  @ApiProperty({ default: 'OJ Tech' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 'This is about organization...' })
  @IsString()
  @IsOptional()
  readonly description: string | null

  @ApiProperty({ default: 'client' })
  @IsString()
  @Matches(/(client|individual|outsourcing)/, { message: 'Organization Type Not Found' })
  readonly organizationType: string

  @ApiProperty({ default: 'Commercial' })
  @IsString()
  @Matches(/(Commercial|Residential)/, { message: 'Project Type Not Found' })
  @IsOptional()
  readonly projectPropertyTypeDefaultValue: string | null

  @ApiProperty({ default: 'Roof Mount' })
  @IsString()
  @Matches(/(Roof Mount|Ground Mount|Roof Mount & Ground Mount)/, { message: 'Mounting Type Not Found' })
  @IsOptional()
  readonly mountingTypeDefaultValue: string | null

  // @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  // @IsBoolean()
  // readonly isActiveContractor: boolean | null

  // @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  // @IsBoolean()
  // readonly isActiveWorkResource: boolean | null

  // @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  // @IsBoolean()
  // readonly isRevenueShare: boolean | null

  // @ApiProperty({ default: true, description: '필요한지 확인 필요' })
  // @IsBoolean()
  // readonly isRevisionRevenueShare: boolean | null

  // @ApiProperty({ default: 'chris kim', description: '필요한지 확인 필요' })
  // @IsString()
  // readonly invoiceRecipient: string | null

  // @ApiProperty({ default: 'chriskim@gmail.com', description: '필요한지 확인 필요' })
  // @IsString()
  // readonly invoiceRecipientEmail: string | null
}
