import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'

export class FindUserRqeustDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string | null

  @ApiProperty({ default: null })
  @IsOptional()
  @IsString()
  readonly organizationId?: string | null

  @ApiProperty({ default: 'BarunCorp' })
  @IsOptional()
  @IsString()
  readonly organizationName?: string | null

  @ApiProperty({ default: null, description: DESCRIPTION.using_like })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    const isBoolean = ['true', 'false'].includes(value)
    return isBoolean ? value === 'true' : null
  })
  readonly isContractor?: boolean | null

  @ApiProperty({ default: null, description: DESCRIPTION.using_like })
  @IsOptional()
  @IsString()
  readonly userName?: string | null
}
