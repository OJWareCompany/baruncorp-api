import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'
import { UserStatusEnum } from '../../domain/user.types'

export class FindUserRqeustDto {
  @ApiProperty({ default: 'hyomin@ojware.com' })
  @IsOptional()
  @IsString()
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

  @ApiProperty({ default: UserStatusEnum.ACTIVE, enum: UserStatusEnum })
  @IsEnum(UserStatusEnum)
  @IsOptional()
  readonly status?: UserStatusEnum | null
}
