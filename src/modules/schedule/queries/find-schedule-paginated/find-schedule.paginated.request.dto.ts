import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class FindSchedulePaginatedRequestDto {
  @ApiProperty({ default: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly userName?: string
}
