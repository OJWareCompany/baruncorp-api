import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsObject, IsString } from 'class-validator'
import { ProjectPropertyType } from '../../domain/project.type'

class AddressRequestDto {
  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  street1: string

  @ApiProperty({ default: null })
  @IsString()
  street2: string | null

  @ApiProperty({ default: 'Lauderdale Lakes' })
  @IsString()
  city: string

  @ApiProperty({ default: 'Florida' })
  @IsString()
  state: string

  @ApiProperty({ default: '33309' })
  @IsString()
  postalCode: string

  @ApiProperty({ default: 'United State' })
  @IsString()
  country: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  fullAddress: string
}

export class CreateProjectRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsIn(['Residential', 'Commercial'])
  projectPropertyType: ProjectPropertyType

  @ApiProperty({ default: 'Chris Kim' })
  @IsString()
  projectPropertyOwner: string

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  organizationId: string

  @ApiProperty({ default: '000152' })
  @IsString()
  projectNumber: string | null

  @ApiProperty({ default: AddressRequestDto })
  @IsObject()
  projectPropertyAddress: AddressRequestDto
}
