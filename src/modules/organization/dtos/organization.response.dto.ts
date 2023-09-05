import { ApiProperty } from '@nestjs/swagger'

export class OrganizationResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  email: string

  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  organizationType: string

  @ApiProperty()
  city: string

  @ApiProperty()
  country: string

  @ApiProperty()
  postalCode: string

  @ApiProperty()
  state: string

  @ApiProperty()
  street1: string

  @ApiProperty()
  street2: string | null

  @ApiProperty({ description: '필요한지 확인 필요' })
  isActiveContractor: boolean | null

  @ApiProperty({ description: '필요한지 확인 필요' })
  isActiveWorkResource: boolean | null

  @ApiProperty({ description: '필요한지 확인 필요' })
  isRevenueShare: boolean | null

  @ApiProperty({ description: '필요한지 확인 필요' })
  isRevisionRevenueShare: boolean | null

  @ApiProperty({ description: '필요한지 확인 필요' })
  invoiceRecipient: string | null

  @ApiProperty({ description: '필요한지 확인 필요' })
  invoiceRecipientEmail: string | null
}
