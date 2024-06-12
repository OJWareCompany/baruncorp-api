import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { DESCRIPTION } from '../../../ordered-job/queries/find-job-paginated/find-job.paginated.request.dto'
import { AHJType } from '../../dto/ahj-note.response.dto'

export class FindAhjNotesSearchQueryRequestDto {
  @ApiProperty({ default: '1239525' })
  @IsString()
  @IsOptional()
  readonly geoId?: string | null

  @ApiProperty({ default: AHJType.STATE, enum: AHJType })
  @IsEnum(AHJType)
  @IsOptional()
  readonly type?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly fullAhjName?: string | null

  @ApiProperty({ description: DESCRIPTION.using_like })
  @IsString()
  @IsOptional()
  readonly name?: string | null
}
