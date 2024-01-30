import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsString } from 'class-validator'

export class FindIntegratedOrderModificationHistoryRequestDto {
  @ApiProperty()
  @IsString()
  readonly entityId: string

  @ApiProperty()
  @IsString()
  readonly jobId: string

  @ApiProperty()
  @IsString()
  readonly attribute: string

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly modifiedAt: Date
}
