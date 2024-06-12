import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateProjectAssociatedRegulatoryRequestDto {
  @ApiProperty({ default: '12' })
  @IsString()
  readonly stateId: string

  @ApiProperty({ default: '12011' })
  @IsString()
  @IsOptional()
  readonly countyId: string | null

  @ApiProperty({ default: '1201191098' })
  @IsString()
  @IsOptional()
  readonly countySubdivisionsId: string | null

  @ApiProperty({ default: '1239525' })
  @IsString()
  @IsOptional()
  readonly placeId: string | null
}

export class UpdateProjectRequestParamDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly projectId: string
}
