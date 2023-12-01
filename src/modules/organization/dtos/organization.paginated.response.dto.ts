import { ApiProperty } from '@nestjs/swagger'
import { PaginatedResponseDto } from '../../../libs/api/page.response.dto'

export class OrganizationPaginatedResponseFields {
  @ApiProperty()
  id: string

  @ApiProperty()
  fullAddress: string

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

  @ApiProperty()
  projectPropertyTypeDefaultValue: string | null

  @ApiProperty()
  mountingTypeDefaultValue: string | null

  @ApiProperty()
  isSpecialRevisionPricing: boolean
}

export class OrganizationPaginatedResponseDto extends PaginatedResponseDto<OrganizationPaginatedResponseFields> {
  @ApiProperty({ type: OrganizationPaginatedResponseFields, isArray: true })
  items: readonly OrganizationPaginatedResponseFields[]
}
