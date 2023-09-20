import { ApiProperty } from '@nestjs/swagger'
import { IsObject } from 'class-validator'
import { AddressDto } from '../../ordered-job/dtos/address.dto'

export class OrganizationResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  email: string | null

  @ApiProperty()
  phoneNumber: string | null

  @ApiProperty()
  organizationType: string

  @ApiProperty({ default: AddressDto })
  @IsObject()
  address: AddressDto

  @ApiProperty()
  projectPropertyTypeDefaultValue: string | null

  @ApiProperty()
  mountingTypeDefaultValue: string | null

  // @ApiProperty({ description: '필요한지 확인 필요' })
  // isActiveContractor: boolean | null

  // @ApiProperty({ description: '필요한지 확인 필요' })
  // isActiveWorkResource: boolean | null

  // @ApiProperty({ description: '필요한지 확인 필요' })
  // isRevenueShare: boolean | null

  // @ApiProperty({ description: '필요한지 확인 필요' })
  // isRevisionRevenueShare: boolean | null

  // @ApiProperty({ description: '필요한지 확인 필요' })
  // invoiceRecipient: string | null

  // @ApiProperty({ description: '필요한지 확인 필요' })
  // invoiceRecipientEmail: string | null
}
