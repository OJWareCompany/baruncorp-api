import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches } from 'class-validator'

export class CreateOrganizationRequestDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ default: 'Apple Valley Airport' })
  @IsString()
  readonly street1: string

  @ApiProperty({ default: 'A 101' })
  @IsString()
  readonly street2: string

  @ApiProperty({ default: 'Apple Valley' })
  @IsString()
  readonly city: string

  @ApiProperty({ default: 'California' })
  @IsString()
  readonly stateOrRegion: string

  @ApiProperty({ default: '92307' })
  @IsString()
  readonly postalCode: string

  @ApiProperty({ default: 'United States' })
  @IsString()
  readonly country: string

  @ApiProperty({ default: '01012341234' })
  @IsString()
  readonly phoneNumber: string

  @ApiProperty({ default: 'OJ Tech' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: 'This is about organization...' })
  @IsString()
  readonly description: string | null

  @ApiProperty({ default: 'client' })
  @IsString()
  @Matches(/(client|individual|outsourcing)/, { message: 'Organization Type Not Found' })
  readonly organizationType: string

  @ApiProperty({ default: 'chris kim' })
  @IsString()
  readonly isActiveContractor: number | null

  @ApiProperty({ default: 'chris kim' })
  @IsString()
  readonly isActiveWorkResource: number | null

  @ApiProperty({ default: 'chris kim' })
  @IsString()
  readonly revenueShare: number | null

  @ApiProperty({ default: 'chris kim' })
  @IsString()
  readonly revisionRevenueShare: number | null

  @ApiProperty({ default: 'chris kim' })
  @IsString()
  readonly invoiceRecipient: string | null

  @ApiProperty({ default: 'chriskim@gmail.com' })
  @IsString()
  readonly invoiceRecipientEmail: string | null
}
