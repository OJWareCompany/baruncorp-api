import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator'
import { ProjectPropertyType } from '../../domain/project.type'

export class AddressRequestDto {
  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  readonly street1: string

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
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

  @ApiProperty({ default: 'United State' })
  @IsString()
  @IsOptional()
  readonly country: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  readonly fullAddress: string
}

export class CreateProjectRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsIn(['Residential', 'Commercial'])
  readonly projectPropertyType: ProjectPropertyType

  @ApiProperty({ default: 'Chris Kim' })
  @IsString()
  @IsOptional()
  readonly projectPropertyOwner: string | null

  @ApiProperty({ default: '07ec8e89-6877-4fa1-a029-c58360b57f43' })
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty({ default: '000152' })
  @IsString()
  @IsOptional()
  readonly projectNumber: string | null

  @ApiProperty({ default: AddressRequestDto })
  @IsObject()
  readonly projectPropertyAddress: AddressRequestDto

  @ApiProperty({ default: [12.1, 22.2] })
  @IsArray()
  readonly coordinates: number[]
}
