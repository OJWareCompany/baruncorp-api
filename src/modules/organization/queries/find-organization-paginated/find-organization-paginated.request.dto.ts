import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class FindOrganizationPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullAddress?: string | null

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
  organizationType?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  projectPropertyTypeDefaultValue?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  mountingTypeDefaultValue?: string | null

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    const isBoolean = ['true', 'false'].includes(value)
    return isBoolean ? value === 'true' : null
  })
  @IsOptional()
  isVendor?: boolean | null
}
