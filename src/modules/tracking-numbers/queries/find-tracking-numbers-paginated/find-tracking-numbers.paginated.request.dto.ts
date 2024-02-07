import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

export class FindTrackingNumbersPaginatedRequestDto {
  @ApiProperty({ default: '674e3b83-0255-46fe-bc4b-047fca3c43cf', required: false })
  @IsOptional()
  @IsString()
  readonly jobId?: string
}
