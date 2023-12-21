import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindOrganizationPaginatedRequestDto {
  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  name?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  fullAddress?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  email?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
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
