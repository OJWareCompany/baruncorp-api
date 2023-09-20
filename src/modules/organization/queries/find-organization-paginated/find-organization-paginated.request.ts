import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindOrganizationPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullAddress?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  organizationType?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  projectPropertyTypeDefaultValue?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  mountingTypeDefaultValue?: string | null
}
