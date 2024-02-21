import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindOrganizationPaginatedRequestDto {
  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly name?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly fullAddress?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly email?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly phoneNumber?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly organizationType?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly projectPropertyTypeDefaultValue?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly mountingTypeDefaultValue?: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly invoiceRecipientEmail?: string | null

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    const isBoolean = ['true', 'false'].includes(value)
    return isBoolean ? value === 'true' : null
  })
  @IsOptional()
  readonly isVendor?: boolean | null
}
