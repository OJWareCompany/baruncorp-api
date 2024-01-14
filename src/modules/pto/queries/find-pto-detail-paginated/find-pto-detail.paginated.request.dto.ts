import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'

export class FindPtoDetailPaginatedRequestDto {
  @ApiProperty({ default: '674e3b83-0255-46fe-bc4b-047fca3c43cf', required: false })
  @IsOptional()
  @IsString()
  readonly userId?: string
  @ApiProperty({ default: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly userName?: string
  @ApiProperty({ default: '2023-06' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly targetMonth?: Date
}
