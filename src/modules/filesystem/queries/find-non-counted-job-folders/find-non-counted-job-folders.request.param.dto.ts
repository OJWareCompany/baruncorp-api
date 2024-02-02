import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsDate } from 'class-validator'

export class FindNonCountedJobFoldersRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly fromDate: Date

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly toDate: Date
}
