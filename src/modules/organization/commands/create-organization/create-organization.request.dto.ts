import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches } from 'class-validator'

export class CreateOrganizationRequestDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  readonly fullAddress: string

  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  readonly street1: string

  @ApiProperty({ default: null })
  @IsString()
  readonly street2: string | null

  @ApiProperty({ default: 'Lauderdale Lakes' })
  @IsString()
  readonly city: string

  @ApiProperty({ default: 'Florida' })
  @IsString()
  readonly state: string

  @ApiProperty({ default: '33309' })
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

  @ApiProperty({ default: true })
  @IsString()
  readonly isActiveContractor: boolean | null

  @ApiProperty({ default: true })
  @IsString()
  readonly isActiveWorkResource: boolean | null

  @ApiProperty({ default: true })
  @IsString()
  readonly isRevenueShare: boolean | null

  @ApiProperty({ default: true })
  @IsString()
  readonly isRevisionRevenueShare: boolean | null

  @ApiProperty({ default: 'chris kim' })
  @IsString()
  readonly invoiceRecipient: string | null

  @ApiProperty({ default: 'chriskim@gmail.com' })
  @IsString()
  readonly invoiceRecipientEmail: string | null
}
