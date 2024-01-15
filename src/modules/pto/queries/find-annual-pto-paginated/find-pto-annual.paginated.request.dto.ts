import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'

export class FindPtoAnnualPaginatedRequestDto {
  @ApiProperty({ default: '2024' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly targetYear: Date
}
